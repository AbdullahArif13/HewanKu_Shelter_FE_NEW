"use client";

import Image from "next/image";
import {
  Column,
  Container,
  Row,
  Text,
} from "@/components/shared/custom_widget";
import { ImageAssets, IconAssets } from "@/common/constant/assets";
import { useGetShelterOrders } from "@/hooks/pesanan.hooks";

function countStatus(orders = [], matcher) {
  return orders.filter((order) => matcher(order.status)).length;
}

export default function HeaderFormStatus() {
  const { orders, isLoading } = useGetShelterOrders();
  const totalForms = orders.length;
  const acceptedForms = countStatus(orders, (status) => /DITERIMA|ACCEPTED|APPROVED/i.test(status || ""));
  const rejectedForms = countStatus(orders, (status) => /DITOLAK|REJECTED|REJECT/i.test(status || ""));

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
            <Text className="font-semibold text-lg">
              {isLoading ? "..." : totalForms}
            </Text>
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
            <Text className="font-semibold text-lg">
              {isLoading ? "..." : acceptedForms}
            </Text>
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
            <Text className="font-semibold text-lg">
              {isLoading ? "..." : rejectedForms}
            </Text>
            <Text className="text-xs text-[#68676E]">Form Ditolak</Text>
          </div>
        </Row>
      </Container>
    </Row>
  );
}
