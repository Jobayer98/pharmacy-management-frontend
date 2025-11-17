"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore, Role } from "@/store/useUserStore";
import { loginApi } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      toast.error("Email & password required");
      return;
    }

    setLoading(true);

    try {
      const response = await loginApi({ email, password });

      setUser({
        token: response.access_token,
        name: response.user.full_name,
        email: response.user.email,
        role: response.user.role,
        userId: response.user.id,
      });

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
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
