"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { 
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat 
} from "@zxing/library";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, SwitchCamera, Flashlight } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  enableVibration?: boolean;
  enableBeep?: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
  onScan, 
  enableVibration = true,
  enableBeep = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasScannedRef = useRef(false);

  // Feedback functions
  const playBeep = useCallback(() => {
    if (!enableBeep) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [enableBeep]);

  const vibrate = useCallback(() => {
    if (!enableVibration || !navigator.vibrate) return;
    navigator.vibrate(200);
  }, [enableVibration]);

  useEffect(() => {
    if (isOpen && !codeReaderRef.current) {
      const hints = new Map();
      const formats = [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.QR_CODE,
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
      hints.set(DecodeHintType.TRY_HARDER, true);
      
      codeReaderRef.current = new BrowserMultiFormatReader(hints);
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    if (!videoRef.current || !codeReaderRef.current) return;

    // Check if camera API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        "Camera not supported. Please use HTTPS or check browser compatibility."
      );
      setIsScanning(false);
      return;
    }

    setIsScanning(true);
    setError(null);
    hasScannedRef.current = false;

    try {
      // Try to enumerate devices first
      let selectedDeviceId: string | undefined;

      try {
        const videoInputDevices =
          await codeReaderRef.current.listVideoInputDevices();

        if (videoInputDevices.length === 0) {
          setError("No camera found on this device");
          setIsScanning(false);
          return;
        }

        setDevices(videoInputDevices);

        // Use the selected device or prefer back camera
        if (currentDeviceIndex < videoInputDevices.length) {
          selectedDeviceId = videoInputDevices[currentDeviceIndex].deviceId;
        } else {
          const backCamera = videoInputDevices.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("rear")
          );
          selectedDeviceId =
            backCamera?.deviceId || videoInputDevices[0].deviceId;
        }
      } catch (enumError) {
        // If enumeration fails, use undefined to let browser choose default camera
        selectedDeviceId = undefined;
      }

      // Get the stream to check torch support
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId 
          ? { deviceId: { exact: selectedDeviceId } }
          : { facingMode: 'environment' }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Check if torch is supported
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as any;
      setTorchSupported(!!capabilities?.torch);

      await codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId ?? null,
        videoRef.current,
        (result, err) => {
          if (result && !hasScannedRef.current) {
            hasScannedRef.current = true;
            const barcode = result.getText();
            console.log("✅ Scanned:", barcode);
            
            // Provide feedback
            playBeep();
            vibrate();
            
            onScan(barcode);
            stopScanning();
            setIsOpen(false);
          }
          // Log errors occasionally to debug
          if (err && Math.random() < 0.01) {
            console.log("Scanning...", err.message);
          }
        }
      );
      console.log("Scanner started, waiting for code...");
    } catch (err: any) {
      let errorMessage = "Failed to start camera";

      if (err.name === "NotAllowedError") {
        errorMessage = "Camera access denied. Please allow camera permission.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "No camera found on this device.";
      } else if (err.name === "NotReadableError") {
        errorMessage = "Camera is already in use by another application.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    // Stop the stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Reset the code reader
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    
    setIsScanning(false);
    setTorchEnabled(false);
  };

  const toggleTorch = async () => {
    if (!streamRef.current || !torchSupported) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      await track.applyConstraints({
        // @ts-ignore - torch is not in TypeScript types yet
        advanced: [{ torch: !torchEnabled }]
      });
      setTorchEnabled(!torchEnabled);
    } catch (err) {
      console.error("Failed to toggle torch:", err);
    }
  };

  const switchCamera = () => {
    if (devices.length <= 1) return;
    
    stopScanning();
    setCurrentDeviceIndex((prev) => (prev + 1) % devices.length);
    
    // Restart scanning with new device
    setTimeout(() => startScanning(), 100);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setError(null);
  };

  const handleClose = () => {
    stopScanning();
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(startScanning, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      <Button 
        onClick={handleOpen} 
        variant="outline" 
        size="icon"
        aria-label="Open barcode scanner"
      >
        <Camera className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Barcode/QR Code</DialogTitle>
            <DialogDescription>
              Point your camera at a barcode or QR code to scan it
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={startScanning} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    autoPlay
                    muted
                    aria-label="Camera viewfinder"
                  />
                  {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                        <p>Starting camera...</p>
                      </div>
                    </div>
                  )}
                  {isScanning && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="border-2 border-green-500 w-64 h-32 rounded-lg shadow-lg animate-pulse"></div>
                      </div>
                      
                      {/* Camera controls */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        {devices.length > 1 && (
                          <Button
                            onClick={switchCamera}
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-black/50 hover:bg-black/70"
                            aria-label="Switch camera"
                          >
                            <SwitchCamera className="h-4 w-4 text-white" />
                          </Button>
                        )}
                        {torchSupported && (
                          <Button
                            onClick={toggleTorch}
                            variant="secondary"
                            size="icon"
                            className={`h-8 w-8 ${
                              torchEnabled 
                                ? 'bg-yellow-500/80 hover:bg-yellow-600/80' 
                                : 'bg-black/50 hover:bg-black/70'
                            }`}
                            aria-label={torchEnabled ? "Turn off flashlight" : "Turn on flashlight"}
                          >
                            <Flashlight className="h-4 w-4 text-white" />
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  {isScanning
                    ? "Position the code within the green frame"
                    : "Initializing camera..."}
                </p>

                <Button onClick={handleClose} variant="outline" className="w-full">
                  Cancel
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
