"use client";

import Image from "next/image";
import {
  Column,
  Container,
  Row,
  Text,
} from "@/components/shared/custom_widget";
import { ImageAssets, IconAssets } from "@/common/constant/assets";

export default function HeaderFormStatus() {
  return (
    <Row className="gap-5">
      <Container className="w-1/4 bg-white rounded-xl p-3">
        <Row className="gap-3">
          <Container className="bg-[#6F4FF2] rounded-full pt-3 pb-3 pl-3 pr-2">
            <Image
              src={IconAssets.note}
              alt="noteIcon"
              width={15}
              height={15}
            />
          </Container>
          <div className="flex flex-col">
            <Text className="font-semibold text-lg">24.000</Text>
            <Text className="text-xs text-[#68676E]">Form Masuk</Text>
          </div>
        </Row>
      </Container>
      <Container className="w-1/4 bg-white rounded-xl p-3">
        <Row className="gap-3">
          <Container className="bg-[#50BB25] rounded-full pt-3 pb-3 pl-3 pr-2">
            <Image
              src={IconAssets.note}
              alt="noteIcon"
              width={15}
              height={15}
            />
          </Container>
          <div className="flex flex-col">
            <Text className="font-semibold text-lg">82.000</Text>
            <Text className="text-xs text-[#68676E]">Form Diterima</Text>
          </div>
        </Row>
      </Container>
      <Container className="w-1/4 bg-white rounded-xl p-3">
        <Row className="gap-3">
          <Container className="bg-[#DC3546] rounded-full pt-3 pb-3 pl-3 pr-2">
            <Image
              src={IconAssets.note}
              alt="noteIcon"
              width={15}
              height={15}
            />
          </Container>
          <div className="flex flex-col">
            <Text className="font-semibold text-lg">89</Text>
            <Text className="text-xs text-[#68676E]">Form Ditolak</Text>
          </div>
        </Row>
      </Container>
    </Row>
  );
}
