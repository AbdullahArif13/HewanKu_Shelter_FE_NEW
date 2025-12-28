"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { IconAssets, ImageAssets } from "@/common/constant/assets";
import { SizedBox, Text } from "@/components/shared/custom_widget";
import { FloatingInput } from "@/components/shared/floating_input";
import { Button } from "@/components/ui/button";
import { useNavigator } from "@/utils/helper";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export default function SetnewpassPage() {
  const nav = useNavigator();
  const { changePass, isLoading } = useAuth();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPass: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email tidak ditemukan. Ulangi proses forgot password.");
      nav.replace("/forgot_pass");
      return;
    }

    if (!formData.password || !formData.confirmPass) {
      toast.error("Password dan Confirm Password wajib diisi");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }

    if (formData.password !== formData.confirmPass) {
      toast.error("Password dan Confirm Password tidak sama");
      return;
    }

    const payload = {
      email,
      password: formData.password,
      repassword: formData.confirmPass,
    };

    const result = await changePass(payload);

    if (result?.success) {
      nav.pushAndRemoveUntil("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-row bg-white">
      {/* Sisi Kiri */}
      <div className="relative flex flex-col justify-start w-3/5 px-12 pt-15">
        <div className="absolute top-8 left-8">
          <Image
            src={ImageAssets.logoApp}
            alt="Logo"
            width={175}
            height={175}
          />
        </div>

        <SizedBox height={50} />

        <Text className="text-3xl font-[600]">Set a password</Text>

        <SizedBox height={15} />

        <Text className="text-base font-[400]">
          Your previous password has been reset. Please set a new password for
          your account.
        </Text>

        <SizedBox height={50} />

        <form onSubmit={handleSubmit}>
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

          <FloatingInput
            id="confirmPass"
            name="confirmPass"
            type="password"
            label="Confirm Password"
            value={formData.confirmPass}
            onChange={handleChange}
            required
          />

          <SizedBox height={30} />

          <Button
            type="submit"
            disabled={isLoading}
            className="h-[45px] w-full bg-[#FF8D28] hover:bg-[#FBA81F] cursor-pointer rounded-sm disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Set password"}
          </Button>
        </form>
      </div>

      {/* Sisi Kanan */}
      <div className="flex justify-center items-center w-2/5 px-4">
        <Image
          src={ImageAssets.setPassMockup}
          alt="setPassMock"
          width={425}
          height={0}
          className="rounded-2xl object-cover"
        />
      </div>
    </div>
  );
}
