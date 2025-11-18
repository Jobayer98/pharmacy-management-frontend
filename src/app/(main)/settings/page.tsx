"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getPharmacy,
  updatePharmacy,
  type PharmacyResponse,
  type UpdatePharmacyRequest,
} from "@/lib/api/settings";

export default function SettingsPage() {
  const { name, role } = useUserStore();
  const queryClient = useQueryClient();

  const [pharmacy, setPharmacy] = useState<UpdatePharmacyRequest>({
    pharmacy_name: "",
    invoice_footer: "",
    email: "",
    phone: "",
    address: "",
  });

  const [profile, setProfile] = useState({
    name: name ?? "",
    email: "admin@example.com",
  });

  // Fetch pharmacy data
  const { data: pharmacyData, isLoading } = useQuery<PharmacyResponse>({
    queryKey: ["pharmacy"],
    queryFn: getPharmacy,
  });

  // Update pharmacy mutation
  const updateMutation = useMutation({
    mutationFn: updatePharmacy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy"] });
      toast.success("Settings saved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save settings");
    },
  });

  // Load pharmacy data into form
  useEffect(() => {
    if (pharmacyData) {
      setPharmacy({
        pharmacy_name: pharmacyData.pharmacy_name,
        invoice_footer: pharmacyData.invoice_footer,
        email: pharmacyData.email,
        phone: pharmacyData.phone,
        address: pharmacyData.address,
      });
    }
  }, [pharmacyData]);

  const saveSettings = () => {
    updateMutation.mutate(pharmacy);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Pharmacy Info */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4">Pharmacy Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Pharmacy Name</label>
            <Input
              value={pharmacy.pharmacy_name}
              onChange={(e) =>
                setPharmacy({ ...pharmacy, pharmacy_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={pharmacy.email}
              onChange={(e) =>
                setPharmacy({ ...pharmacy, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={pharmacy.phone}
              onChange={(e) =>
                setPharmacy({ ...pharmacy, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <Input
              value={pharmacy.address}
              onChange={(e) =>
                setPharmacy({ ...pharmacy, address: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Invoice Footer</label>
            <Textarea
              value={pharmacy.invoice_footer}
              onChange={(e) =>
                setPharmacy({ ...pharmacy, invoice_footer: e.target.value })
              }
              placeholder="Text to appear at the bottom of invoices"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4">User Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Name</label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <Input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Admin Only Section */}
      {role === "admin" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-800">
          <h2 className="text-lg font-semibold mb-4">Admin Settings</h2>
          <p className="text-sm text-muted-foreground">
            Role management, user management, and advanced settings will go here
            later.
          </p>
        </div>
      )}

      <div>
        <Button onClick={saveSettings} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
