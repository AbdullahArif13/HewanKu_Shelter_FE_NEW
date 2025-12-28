"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconAssets, ImageAssets } from "@/common/constant/assets";
import { SizedBox, Text } from "@/components/shared/custom_widget";
import { FloatingInput } from "@/components/shared/floating_input";
import { Button } from "@/components/ui/button";
import { useNavigator } from "@/utils/helper";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export default function VerifycodePage() {
  const nav = useNavigator();
  const { verifyOTP, forgotPassword, isLoading } = useAuth();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    otpCode: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email tidak ditemukan. Ulangi proses forgot password.");
      nav.replace("/forgot_pass");
      return;
    }

    if (!formData.otpCode) {
      toast.error("Kode OTP wajib diisi");
      return;
    }

    const payload = {
      email,
      otp: formData.otpCode,
    };

    const result = await verifyOTP(payload);

    if (result?.success) {
      nav.replace(
        `/set_new_pass?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(formData.otpCode)}`
      );
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email tidak ditemukan. Ulangi proses forgot password.");
      nav.replace("/forgot_pass");
      return;
    }

    const res = await forgotPassword({ email });
    if (res?.success) {
      toast.success("OTP dikirim ulang");
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

        <button
          type="button"
          onClick={() => nav.pushAndRemoveUntil("/login")}
          className="flex flex-row items-center cursor-pointer"
        >
          <Image src={IconAssets.back} alt="backIcon" width={20} height={20} />
          <SizedBox width={8} />
          <Text className="text-sm font-[500]">Back to Login</Text>
        </button>

        <SizedBox height={30} />

        <Text className="text-3xl font-[600]">Verify code</Text>

        <SizedBox height={15} />

        <Text className="text-base font-[400]">
          An authentication code has been sent to your email
          {email ? ` (${email})` : ""}.
        </Text>

        <SizedBox height={50} />

        <form onSubmit={handleVerify}>
          <FloatingInput
            id="otpCode"
            name="otpCode"
            label="Enter code"
            value={formData.otpCode}
            onChange={handleChange}
            required
          />

          <SizedBox height={15} />

          <p className="text-start font-[500] text-sm">
            Didn’t receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="font-[500] hover:underline text-[#FF8D28] cursor-pointer"
              disabled={isLoading}
            >
              Resend
            </button>
          </p>

          <SizedBox height={30} />

          <Button
            type="submit"
            disabled={isLoading}
            className="h-[45px] w-full bg-[#FF8D28] hover:bg-[#FBA81F] cursor-pointer rounded-sm disabled:opacity-60"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>

      {/* Sisi Kanan */}
      <div className="flex justify-center items-center w-2/5 px-4">
        <Image
          src={ImageAssets.otpMockup}
          alt="otpMock"
          width={425}
          height={0}
          className="rounded-2xl object-cover"
        />
      </div>
    </div>
  );
}
