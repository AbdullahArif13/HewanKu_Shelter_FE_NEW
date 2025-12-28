"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Column,
  Container,
  Row,
  Text,
  SizedBox,
} from "@/components/shared/custom_widget";
import { dummyAnimal } from "@/data/dummy/data_dummy";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { ImageAssets, IconAssets } from "@/common/constant/assets";
import { formatRupiah } from "@/utils/helper";

export default function TableHome() {
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 4;

  const totalPosts = dummyAnimal.length;
  const totalPages = Math.ceil(totalPosts / postPerPage);

  const endIndex = currentPage * postPerPage;
  const startIndex = endIndex - postPerPage;
  const currentPosts = dummyAnimal.slice(startIndex, endIndex);

  const paginate = (page) => setCurrentPage(page);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <>
      <Container className="w-full border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_1.0fr_0.5fr_0.5fr] px-6 py-4 border-b border-[#6C7AA0] text-sm font-semibold text-gray-900">
          <div>Daftar Hewan</div>
          <div>Harga</div>
          <div>Status</div>
          <div>Tanggal Terakhir Update</div>
          <div>Edit</div>
          <div>Hapus</div>
        </div>

        <div className="divide-y">
          {currentPosts.map((item) => (
            <div
              key={item.id}
              className="my-4 grid grid-cols-[1.6fr_0.8fr_0.8fr_1.0fr_0.5fr_0.5fr] px-6 py-3 items-center bg-white rounded-4xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={item.animalImage}
                    alt={item.animalName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-gray-900 leading-5 truncate">
                    {item.animalName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.animalBreed}
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-900">
                {formatRupiah(item.price)}
              </div>
              <div className="text-xs text-gray-900">{item.status}</div>

              <div className="text-xs text-gray-900">{item.timeInText}</div>

              <button className="cursor-pointer">
                <Image
                  src={IconAssets.edit}
                  alt={item.id}
                  height={25}
                  width={25}
                  className="object-cover"
                />
              </button>
              <button className="cursor-pointer">
                <Image
                  src={IconAssets.delete}
                  alt={item.id}
                  height={25}
                  width={25}
                  className="object-cover"
                />
              </button>
            </div>
          ))}
        </div>
      </Container>
      <Row className="gap-x-2 my-2" mainAxisAlignment="between">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-md border text-xs font-medium transition-colors
            ${
              currentPage === 1
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-500 cursor-pointer bg-white hover:bg-gray-50"
            }`}
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <div className="flex items-center gap-x-2 mx-2">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-semibold transition-all cursor-pointer
                ${
                  currentPage === number
                    ? "bg-orange-500 text-white border-none shadow-sm"
                    : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-4 py-2 rounded-md border text-xs font-medium transition-colors
            ${
              currentPage === totalPages
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-500 cursor-pointer bg-white hover:bg-gray-50"
            }`}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </Row>
    </>
  );
}
