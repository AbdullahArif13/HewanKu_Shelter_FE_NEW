"use client";

import Image from "next/image";
import { ImageAssets } from "@/common/constant/assets";
import { SizedBox, Text } from "@/components/shared/custom_widget";

import FormRegister from "./components/form_register";
import SocialRegister from "./components/social_register";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-row bg-white">
      {/* Sisi Kiri */}
      <div className="flex justify-center items-center w-2/5 px-4">
        <Image
          src={ImageAssets.registerMockup}
          alt="registerMock"
          width={425}
          height={500}
          loading="eager"
          className="rounded-2xl object-cover w-full h-auto"
        />
      </div>

      {/* Sisi Kanan */}
      <div className="relative flex flex-col justify-center w-3/5 px-12">
        <div className="absolute top-8 right-8">
          <Image
            src={ImageAssets.logoApp}
            alt="Logo"
            width={175}
            height={175}
          />
        </div>
        <Text className="text-3xl font-[600]">Sign up</Text>
        <SizedBox height={15} />
        <Text className="text-base font-[400] text-gray-700">
          Let’s get you all set up so you can access your personal account.
        </Text>
        <SizedBox height={30} />
        <FormRegister />
        <SizedBox height={30} />
        <SocialRegister />
      </div>
    </div>
  );
}
