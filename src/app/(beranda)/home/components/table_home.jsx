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
import { useNavigator } from "@/utils/helper";
import { useGetShelterAnimals, useDeleteAnimalMutation } from "@/hooks/animal.hooks";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconAssets } from "@/common/constant/assets";
import { formatRupiah } from "@/utils/helper";

export default function TableHome() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const nav = useNavigator();

  const { animals, isLoading, refetch } = useGetShelterAnimals();
  const { deleteAnimalMutation } = useDeleteAnimalMutation({
    successAction: () => {
      refetch();
      setSelectedDeleteId(null);
    },
  });

  const postPerPage = 4;
  const totalPosts = animals.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postPerPage));
  const endIndex = currentPage * postPerPage;
  const startIndex = endIndex - postPerPage;
  const currentPosts = animals.slice(startIndex, endIndex);

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
          {isLoading ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">Memuat daftar hewan...</div>
          ) : currentPosts.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">Belum ada hewan di shelter.</div>
          ) : (
            currentPosts.map((item) => {
              const animalId = item.id || item._id;
              return (
                <div
                  key={animalId}
                  className="my-4 grid grid-cols-[1.6fr_0.8fr_0.8fr_1.0fr_0.5fr_0.5fr] px-6 py-3 items-center bg-white rounded-4xl"
                >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={item.animalImage || item.image || "/images/shelter_placeholder.png"}
                      alt={item.animalName || item.namaHewan}
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

                <div className="text-xs text-gray-900">
                  {formatRupiah(item.price || item.harga || 0)}
                </div>
                <div className="text-xs text-gray-900">{item.status || "-"}</div>

                <div className="text-xs text-gray-900">{item.timeInText || item.updatedAt || "-"}</div>

                <button
                  type="button"
                  onClick={() => nav.push(`/home/edit_hewan/${animalId}`)}
                  className="flex items-center justify-center rounded-full w-9 h-9 bg-orange-50 hover:bg-orange-100 transition"
                >
                  <Image
                    src={IconAssets.edit}
                    alt="Edit"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-full w-9 h-9 bg-red-50 hover:bg-red-100 transition"
                    >
                      <Image
                        src={IconAssets.delete}
                        alt="Delete"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Hewan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus hewan ini? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteAnimalMutation.mutate({ id: animalId })}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              );
            })
          )}
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
