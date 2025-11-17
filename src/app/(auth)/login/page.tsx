"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore, Role } from "@/store/useUserStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (!email || !password) {
      toast.error("Email & password required");
      return;
    }

    // Mock login
    let selectedRole: Role = "admin";

    if (email.includes("manager")) selectedRole = "manager";
    if (email.includes("sales")) selectedRole = "sales";

    setUser({
      token: "mock-token-123",
      role: selectedRole,
      name: email.split("@")[0],
    });

    toast.success(`Logged in as ${selectedRole}`);
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-xl shadow">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Pharmacy Login
        </h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="•••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={login}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
