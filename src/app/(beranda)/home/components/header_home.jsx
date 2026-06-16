"use client";

import {
  SizedBox,
  Text,
  Container,
  Row,
} from "@/components/shared/custom_widget";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IconAssets } from "@/common/constant/assets";
import { useNavigator } from "@/utils/helper";
import { useShelter } from "@/contexts/shelter-context";
import { useAuth } from "@/contexts/auth-context";
import { useGetShelterAnimals } from "@/hooks/animal.hooks";

export default function HeaderHome() {
  const nav = useNavigator();
  const { isLoading: authLoading } = useAuth();
  const { hasShelter, isLoading, shelter } = useShelter();
  const { animals, isLoading: animalsLoading } = useGetShelterAnimals({ enabled: hasShelter });

  if (authLoading || isLoading) return null;

  const animalCount = animalsLoading ? "..." : animals.length;
  const bannerImageUrl = shelter?.foto || "/images/shelter_placeholder.png";

  return (
    <Row className="gap-12">
      <Container className="relative w-1/2 rounded-lg p-5 flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${bannerImageUrl})` }} />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10">
          <Text className="font-semibold text-neutral-50 text-xl mb-1">
            Ayo Buat Shelter Kamuu
          </Text>
          <Text className="text-neutral-50 text-sm">
            Berikan Kenyamanan buat hewanmu
          </Text>

          <SizedBox height={25} />

          {!hasShelter ? (
            <Button
              type="button"
              onClick={() => nav.push("/home/buat_shelter")}
              className="h-[40px] w-1/4 bg-[#FF8D28] hover:bg-[#FBA81F] rounded-sm"
            >
              Buat Shelter
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => nav.push("/home/tambah_hewan")}
              className="h-[40px] w-1/4 bg-[#198754] hover:bg-[#157347] rounded-sm"
            >
              Tambah Hewan
            </Button>
          )}
        </div>
      </Container>

      <div className="flex flex-col">
        <Text className="font-semibold text-xl mb-1">
          Hewan di Shelter kamu
        </Text>
        <Text className="text-sm mb-5">
          Jaga Hewan Kamu dengan baik sebelum adopsi
        </Text>

        <Container className="bg-white rounded-xl p-3">
          <Row className="gap-3">
            <Container className="bg-[#FD7E14] rounded-full p-3">
              <Image
                src={IconAssets.note}
                alt="noteIcon"
                width={15}
                height={15}
              />
            </Container>

            <div className="flex flex-col">
              <Text className="font-semibold text-lg">{animalCount}</Text>
              <Text className="text-xs text-[#68676E]">
                Hewan yang siap di adopsi
              </Text>
            </div>
          </Row>
        </Container>
      </div>
    </Row>
  );
}
