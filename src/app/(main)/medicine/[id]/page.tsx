"use client";

import { useQuery } from "@tanstack/react-query";
import { getMedicineDetail } from "@/lib/api/medicine";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Pill, Building2, Tag, Barcode, Image as ImageIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function MedicineDetailPage() {
  const router = useRouter();
  const params = useParams();
  const medicineId = parseInt(params.id as string);

  const { data: medicine, isLoading, isError } = useQuery({
    queryKey: ["medicine-detail", medicineId],
    queryFn: () => getMedicineDetail(medicineId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError || !medicine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Medicine not found</p>
        <Button onClick={() => router.push("/medicine")}>
          Back to Medicine List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/medicine")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Medicine Details</h1>
        </div>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side - Image */}
            <div className="flex items-center justify-center bg-gray-50 dark:bg-zinc-800 rounded-lg p-8">
              {medicine.image_url ? (
                <img
                  src={medicine.image_url}
                  alt={medicine.name}
                  className="max-w-full max-h-64 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <ImageIcon className="h-24 w-24" />
                  <p className="text-sm">No image available</p>
                </div>
              )}
            </div>

            {/* Right Side - Details */}
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold">{medicine.name}</h2>
                {medicine.generic_name && (
                  <p className="text-lg text-muted-foreground mt-1">
                    {medicine.generic_name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                {/* Brand */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="font-medium">{medicine.brand || "N/A"}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Tag className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{medicine.category || "N/A"}</p>
                  </div>
                </div>

                {/* Strength */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Pill className="h-5 w-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Strength</p>
                    <p className="font-medium">{medicine.strength}</p>
                  </div>
                </div>

                {/* Unit */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Package className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unit</p>
                    <p className="font-medium">{medicine.unit || "N/A"}</p>
                  </div>
                </div>

                {/* Barcode */}
                {medicine.barcode && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                      <Barcode className="h-5 w-5 text-gray-600 dark:text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Barcode</p>
                      <p className="font-medium font-mono">{medicine.barcode}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggested Alternatives Section - Placeholder */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">AI Suggested Alternative Brands</h3>
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
              Coming Soon
            </span>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg p-6 text-center">
            <p className="text-muted-foreground">
              AI-powered alternative medicine suggestions will be available here soon.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Get smart recommendations for alternative brands with the same generic composition.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
