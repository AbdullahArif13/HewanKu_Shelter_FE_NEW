"use client";

import Image from "next/image";
import { IconAssets } from "@/common/constant/assets";
import { SizedBox, Row } from "@/components/shared/custom_widget";
import { Button } from "@/components/ui/button";

export default function SocialLogin() {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">
            Or login with
          </span>
        </div>
      </div>
      <SizedBox height={30} />
      <Row mainAxisAlignment="between">
        <Button
          className="w-[200px] h-[70px] border border-[#515DEF] hover:bg-stone-50 cursor-pointer rounded-sm"
          variant="outline"
        >
          <Image
            src={IconAssets.facebookIcon}
            alt="Facebook"
            width={30}
            height={30}
          />
        </Button>
        <Button
          className="w-[200px] h-[70px] border border-[#515DEF] hover:bg-stone-50 cursor-pointer rounded-sm"
          variant="outline"
        >
          <Image
            src={IconAssets.googleIcon}
            alt="Google"
            width={30}
            height={30}
          />
        </Button>
        <Button
          className="w-[200px] h-[70px] border border-[#515DEF] hover:bg-stone-50 cursor-pointer rounded-sm"
          variant="outline"
        >
          <Image
            src={IconAssets.appleIcon}
            alt="Apple"
            width={30}
            height={30}
          />
        </Button>
      </Row>
    </div>
  );
}
