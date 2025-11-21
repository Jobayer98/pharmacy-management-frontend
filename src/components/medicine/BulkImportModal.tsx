"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMedicinesBulk, type MedicinePayload } from "@/lib/api/medicine";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BulkImportModalProps {
  open: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  open,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<MedicinePayload[] | null>(null);
  const queryClient = useQueryClient();

  const bulkCreateMutation = useMutation({
    mutationFn: createMedicinesBulk,
    onSuccess: (data) => {
      toast.success(`Successfully imported ${data?.length || 0} medicines`);
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      setSelectedFile(null);
      setPreviewData(null);
      ``;
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to import medicines");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error("Please select a JSON file");
      return;
    }

    setSelectedFile(file);

    // Read and preview file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          toast.error("JSON file must contain an array of medicines");
          setSelectedFile(null);
          return;
        }
        setPreviewData(json);
      } catch (error) {
        toast.error("Invalid JSON file");
        setSelectedFile(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!previewData) {
      toast.error("No data to import");
      return;
    }

    if (previewData.length === 0) {
      toast.error("No medicines to import");
      return;
    }

    // Validate required fields
    for (let i = 0; i < previewData.length; i++) {
      if (!previewData[i].name || !previewData[i].strength) {
        toast.error(`Medicine at index ${i} is missing required fields (name, strength)`);
        return;
      }
    }

    bulkCreateMutation.mutate(previewData);
  };

  const exampleJson = `[
  {
    "name": "Napa",
    "generic_name": "Paracetamol",
    "brand": "Square",
    "category": "Tablet",
    "unit": "Strip",
    "strength": "500mg",
    "barcode": "8940001280419",
    "image_url": null
  },
  {
    "name": "Ace",
    "generic_name": "Paracetamol",
    "brand": "Square",
    "category": "Tablet",
    "unit": "Strip",
    "strength": "500mg",
    "barcode": null,
    "image_url": null
  }
]`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Import Medicines</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Upload a JSON file containing an array of medicines. Required fields: name, strength
            </p>
            
            <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded text-xs mb-3">
              <p className="font-semibold mb-1">Example format:</p>
              <pre className="overflow-x-auto">{exampleJson}</pre>
            </div>

            {/* File Input */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="json-file-input"
              />
              <label
                htmlFor="json-file-input"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <svg
                  className="w-12 h-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium">
                    {selectedFile ? selectedFile.name : "Click to upload JSON file"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or drag and drop
                  </p>
                </div>
              </label>
            </div>

            {/* Preview */}
            {previewData && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-400">
                  ✓ File loaded successfully
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                  {previewData.length} medicine(s) ready to import
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={bulkCreateMutation.isPending || !previewData}
            className="flex-1"
          >
            {bulkCreateMutation.isPending ? "Importing..." : "Import Medicines"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
