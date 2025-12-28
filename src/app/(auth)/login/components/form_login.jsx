"use client";

import { useState } from "react";
import { SizedBox } from "@/components/shared/custom_widget";
import { FloatingInput } from "@/components/shared/floating_input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

export default function FormLogin() {
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    await login({
      body: {
        email: formData.email,
        password: formData.password,
      },
    });
  };

  return (
    <form onSubmit={handleLogin}>
      <FloatingInput
        id="email"
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <SizedBox height={20} />

      <FloatingInput
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <SizedBox height={20} />

      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(v) => setRememberMe(Boolean(v))}
            className="cursor-pointer data-[state=checked]:bg-[#FF8D28] data-[state=checked]:border-bg-[#FF8D28]"
          />
          <Label htmlFor="rememberMe">Remember Me</Label>
        </div>

        <Link
          href="/forgot_pass"
          className="text-base font-[500] cursor-pointer text-[#FF8D28]"
        >
          Forgot Password
        </Link>
      </div>

      <SizedBox height={30} />

      <Button
        type="submit"
        disabled={isLoading}
        className="h-[45px] w-full bg-[#FF8D28] hover:bg-[#FBA81F] cursor-pointer rounded-sm disabled:opacity-60"
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      <SizedBox height={15} />

      <p className="text-center font-[500] text-sm">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="font-[500] hover:underline text-[#FF8D28]"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
