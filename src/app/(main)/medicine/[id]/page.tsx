"use client";

import { useQuery } from "@tanstack/react-query";
import { getMedicineDetail, getAlternativeMedicines } from "@/lib/api/medicine";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Package,
  Pill,
  Building2,
  Tag,
  Barcode,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function MedicineDetailPage() {
  const router = useRouter();
  const params = useParams();
  const medicineId = parseInt(params.id as string);

  const {
    data: medicine,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["medicine-detail", medicineId],
    queryFn: () => getMedicineDetail(medicineId),
  });

  const { data: alternatives, isLoading: isLoadingAlternatives } = useQuery({
    queryKey: ["alternative-medicines", medicine?.generic_name, medicineId],
    queryFn: () => getAlternativeMedicines(medicine!.generic_name!, medicineId),
    enabled: !!medicine?.generic_name,
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
                      <p className="font-medium font-mono">
                        {medicine.barcode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Medicines Section */}
      {medicine.generic_name && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Alternative Medicines</h3>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
                Same Generic
              </span>
            </div>

            {isLoadingAlternatives ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading alternatives...
              </div>
            ) : alternatives && alternatives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alternatives.map((alt) => (
                  <Card
                    key={alt.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/medicine/${alt.id}`)}
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-lg">{alt.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {alt.generic_name}
                          </p>
                        </div>

                        <div className="space-y-2 text-sm">
                          {alt.brand && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{alt.brand}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-muted-foreground" />
                            <span>{alt.strength}</span>
                          </div>

                          {alt.category && (
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span>{alt.category}</span>
                            </div>
                          )}

                          <div className="pt-2 border-t dark:border-zinc-800">
                            <p className="text-lg font-bold text-green-600 dark:text-green-500">
                              ৳ {alt.price}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/medicine/${alt.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No alternative medicines found with the same generic name.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Generic:{" "}
                  <span className="font-medium">{medicine.generic_name}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
