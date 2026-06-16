"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Column,
  Container,
  Row,
  Text,
} from "@/components/shared/custom_widget";
import { useGetShelterOrders } from "@/hooks/pesanan.hooks";
import { ImageAssets } from "@/common/constant/assets";
import { formatRupiah } from "@/utils/helper";
import { ChevronLeft, ChevronRight } from "lucide-react";

const paymentLogoMap = {
  qris: ImageAssets.qrisLogo,
  mandiri: ImageAssets.mandiriLogo,
  gopay: ImageAssets.gopayLogo,
  dana: ImageAssets.danaLogo,
};

export default function PembayaranPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 6;

  const { orders, isLoading } = useGetShelterOrders();

  const totalPosts = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postPerPage));

  const endIndex = currentPage * postPerPage;
  const startIndex = endIndex - postPerPage;
  const currentEndIndex = Math.min(endIndex, totalPosts);
  const currentPosts = orders.slice(startIndex, endIndex);

  const paginate = (page) => setCurrentPage(page);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <Column crossAxisAlignment="start" className="w-full p-6">
      <Text className="font-semibold text-xl mb-4">Pembayaran</Text>

      <Container className="w-full border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr_0.9fr] px-6 py-4 border-b-2 border-[#6C7AA0] text-sm font-semibold text-gray-900">
          <div>Daftar Hewan</div>
          <div>Harga</div>
          <div>Pembayaran</div>
          <div>User</div>
          <div>Waktu Masuk</div>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {isLoading ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">Memuat data pembayaran...</div>
          ) : currentPosts.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">Belum ada pembayaran</div>
          ) : (
            currentPosts.map((item) => (
              <div
                key={item.id}
                className="my-4 grid grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr_0.9fr] px-6 py-2 items-center bg-white rounded-4xl"
              >
                {/* Daftar Hewan */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={item.animalImage || item.image || "/images/placeholder.png"}
                      alt={item.animalName || item.namaHewan || "Animal"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-gray-900 leading-5 truncate">
                      {item.animalName || item.namaHewan}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.animalBreed || item.kategori}
                    </p>
                  </div>
                </div>

                {/* Harga */}
                <div className="text-xs text-gray-900">
                  {formatRupiah(item.price || item.harga || 0)}
                </div>

                {/* Pembayaran (Payment Method) */}
                <div className="flex items-center gap-2">
                  {paymentLogoMap[item.metodePembayaran?.toLowerCase()] && (
                    <Image
                      src={paymentLogoMap[item.metodePembayaran?.toLowerCase()]}
                      alt={item.metodePembayaran}
                      width={20}
                      height={20}
                    />
                  )}
                  <span className="text-xs text-gray-900">{item.metodePembayaran || "-"}</span>
                </div>

                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={item.userAvatar || item.adopter?.avatar || "/images/placeholder.png"}
                      alt={item.userName || item.adopter?.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-900 truncate">
                    {item.userName || item.adopter?.name}
                  </p>
                </div>

                {/* Waktu Masuk */}
                <div className="text-xs text-gray-900">{item.timeInText || item.createdAt || "-"}</div>
              </div>
            ))
          )}
        </div>
      </Container>

      {/* Pagination */}
      <Row className="gap-x-2 my-4" mainAxisAlignment="between">
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
    </Column>
  );
}
