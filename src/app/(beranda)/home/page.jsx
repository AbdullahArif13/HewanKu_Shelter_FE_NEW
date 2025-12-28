"use client";

import {
  Column,
  Container,
  Row,
  Text,
  SizedBox,
} from "@/components/shared/custom_widget";
import HeaderHome from "./components/header_home";
import TableHome from "./components/table_home";
import { useShelter } from "@/contexts/shelter-context";
import { useAuth } from "@/contexts/auth-context";

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasShelter, isLoading } = useShelter();

  if (authLoading || isLoading) return null;
  return (
    <Column>
      <HeaderHome />
      <SizedBox height={25} />
      {hasShelter && <TableHome />}
      {!hasShelter && (
        <Container className="bg-white rounded-xl p-8 text-center mt-6">
          <Text className="text-lg font-semibold mb-2">
            Kamu belum memiliki shelter
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            Silakan buat shelter terlebih dahulu untuk mengelola hewan.
          </Text>
        </Container>
      )}
    </Column>
  );
}
