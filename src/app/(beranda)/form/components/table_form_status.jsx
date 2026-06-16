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
import { useGetShelterOrders, useConfirmOrderMutation } from "@/hooks/pesanan.hooks";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";

export default function TableFormStatus() {
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 4;

  const { orders, isLoading, refetch } = useGetShelterOrders();
  const { mutate: confirmOrderMutate, isPending: isConfirming } = useConfirmOrderMutation({
    successAction: () => {
      refetch();
      setSelectedOrderId(null);
      setConfirmAction(null);
    },
  });

  const totalPosts = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postPerPage));

  const endIndex = currentPage * postPerPage;
  const startIndex = endIndex - postPerPage;
  const currentPosts = orders.slice(startIndex, endIndex);

  const paginate = (page) => setCurrentPage(page);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  const handleConfirmOrder = (id, status) => {
    confirmOrderMutate({ id, status });
  };

  return (
    <>
      <Container className="w-full border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr_0.5fr_0.5fr] px-6 py-4 border-b border-[#6C7AA0] text-sm font-semibold text-gray-900">
          <div>Daftar Hewan</div>
          <div>Lihat Form</div>
          <div>Waktu Masuk</div>
          <div>User</div>
          <div>Setuju</div>
          <div>Tolak</div>
        </div>

        <div className="divide-y">
          {isLoading ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">Memuat data form...</div>
          ) : currentPosts.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">Belum ada form yang masuk</div>
          ) : (
            currentPosts.map((item) => (
              <div
                key={item.id || item._id}
                className="my-4 grid grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr_0.5fr_0.5fr] px-6 py-3 items-center bg-white rounded-4xl"
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

                {/* Lihat Form */}
                <div className="text-xs text-gray-900 cursor-pointer text-blue-600 hover:underline">
                  {item.pdf || item.formUrl ? "Lihat" : "-"}
                </div>

                {/* Waktu Masuk */}
                <div className="text-xs text-gray-900">{item.timeInText || item.createdAt || "-"}</div>

                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
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

                {/* Setuju (Approve) */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="cursor-pointer p-1 rounded-full hover:bg-green-50 transition">
                      <Check color="#22c55e" size={20} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Setujui Formulir</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menerima (DITERIMA) formulir adopsi ini?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleConfirmOrder(item.id || item._id, "DITERIMA")}
                        disabled={isConfirming}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        {isConfirming ? "Memproses..." : "Setuju"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Tolak (Reject) */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="cursor-pointer p-1 rounded-full hover:bg-red-50 transition">
                      <X color="#ef4444" size={20} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tolak Formulir</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menolak (DITOLAK) formulir adopsi ini?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleConfirmOrder(item.id || item._id, "DITOLAK")}
                        disabled={isConfirming}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        {isConfirming ? "Memproses..." : "Tolak"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
    </>
  );
}
