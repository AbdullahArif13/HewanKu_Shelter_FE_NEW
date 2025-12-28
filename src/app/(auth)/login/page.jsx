"use client";

import Image from "next/image";
import { ImageAssets } from "@/common/constant/assets";
import { SizedBox, Text } from "@/components/shared/custom_widget";

import SocialLogin from "./components/social_login";
import FormLogin from "./components/form_login";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-row bg-white">
      {/* Sisi Kiri */}
      <div className="relative flex flex-col justify-center w-3/5 px-12">
        <div className="absolute top-8 left-8">
          <Image
            src={ImageAssets.logoApp}
            alt="Logo"
            width={150}
            height={150}
          />
        </div>

        <SizedBox height={50} />
        <Text className="text-3xl font-semibold">Login</Text>
        <SizedBox height={15} />
        <Text className="text-base font-normal">
          Login to access your travelwise account
        </Text>
        <SizedBox height={30} />
        <FormLogin />
        <SizedBox height={30} />
        <SocialLogin />
      </div>

      {/* Sisi Kanan */}
      <div className="flex justify-center items-center w-2/5 px-4">
        <Image
          src={ImageAssets.loginMockup}
          alt="loginMock"
          width={425}
          height={0}
          className="rounded-2xl object-cover"
        />
      </div>
    </div>
  );
}
