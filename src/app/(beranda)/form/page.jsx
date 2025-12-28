"use client";

import {
  Column,
  Container,
  Row,
  Text,
  SizedBox,
} from "@/components/shared/custom_widget";
import HeaderFormStatus from "./components/header_form_status";
import TableFormStatus from "./components/table_form_status";

export default function FormPage() {
  return (
    <Column crossAxisAlignment="start" className="w-full">
      <Text className="font-semibold text-xl mb-4">Form Masuk</Text>
      <HeaderFormStatus />
      <SizedBox height={25} />
      <TableFormStatus />
    </Column>
  );
}
