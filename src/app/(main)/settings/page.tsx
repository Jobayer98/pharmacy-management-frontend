"use client";

import React, { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const { name, role } = useUserStore();

  const [pharmacy, setPharmacy] = useState({
    name: "My Pharmacy",
    address: "123 Main Street",
    phone: "01700000000",
  });

  const [profile, setProfile] = useState({
    name: name ?? "",
    email: "admin@example.com",
  });

  const saveSettings = () => {
    toast.success("Settings saved (mock)");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Pharmacy Info */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4">Pharmacy Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Pharmacy Name</label>
            <Input
              value={pharmacy.name}
              onChange={(e) =>
                setPharmacy({ ...pharmacy, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm">Phone</label>
            <Input
              value={pharmacy.phone}
              onChange={(e) =>
                setPharmacy({ ...pharmacy, phone: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm">Address</label>
            <Input
              value={pharmacy.address}
              onChange={(e) =>
                setPharmacy({ ...pharmacy, address: e.target.value })
              }
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
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  );
}
