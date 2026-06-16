import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getShelterAnimals,
  getAnimalDetails,
  addAnimal,
  editAnimal,
  deleteAnimal,
} from "@/actions/animal.action";

function extractArrayPayload(data) {
  const payload = data?.details;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.animals)) return payload.animals;
  return [];
}

export function useGetShelterAnimals() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getShelterAnimals"],
    queryFn: () => getShelterAnimals(),
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Gagal memuat daftar hewan", {
        description: error?.message || "Terjadi kesalahan saat mengambil data hewan.",
      });
    },
  });

  const animals = useMemo(() => extractArrayPayload(data), [data]);

  return {
    animals,
    isLoading,
    isError,
    refetch,
  };
}

export function useGetAnimalDetails({ id }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getAnimalDetails", id],
    queryFn: () => getAnimalDetails({ id }),
    enabled: Boolean(id),
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Gagal memuat detail hewan", {
        description: error?.message || "Terjadi kesalahan saat mengambil detail hewan.",
      });
    },
  });

  const animal = useMemo(() => {
    if (!data?.details) return null;
    return data.details;
  }, [data]);

  return {
    animal,
    isLoading,
    isError,
    refetch,
  };
}

export function useAddAnimalMutation({ successAction }) {
  const queryClient = useQueryClient();

  const addAnimalMutation = useMutation({
    mutationFn: ({ payload }) => addAnimal({ body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 201 || data?.details?.code === 201) {
        toast.success(data?.details?.message || "Hewan berhasil ditambahkan");
        queryClient.invalidateQueries({ queryKey: ["getShelterAnimals"] });
        successAction?.();
      } else {
        toast.error("Gagal menambahkan hewan", {
          description: data?.details?.message || data?.message || "Terjadi kesalahan.",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal menambahkan hewan", {
        description: error?.message || "Terjadi kesalahan.",
      });
    },
  });

  return { addAnimalMutation };
}

export function useEditAnimalMutation({ successAction }) {
  const queryClient = useQueryClient();

  const editAnimalMutation = useMutation({
    mutationFn: ({ id, payload }) => editAnimal({ id, body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 200 || data?.details?.code === 200) {
        toast.success(data?.details?.message || "Hewan berhasil diperbarui");
        queryClient.invalidateQueries({ queryKey: ["getShelterAnimals"] });
        queryClient.invalidateQueries({ queryKey: ["getAnimalDetails"] });
        successAction?.();
      } else {
        toast.error("Gagal memperbarui hewan", {
          description: data?.details?.message || data?.message || "Terjadi kesalahan.",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal memperbarui hewan", {
        description: error?.message || "Terjadi kesalahan.",
      });
    },
  });

  return { editAnimalMutation };
}

export function useDeleteAnimalMutation({ successAction }) {
  const queryClient = useQueryClient();

  const deleteAnimalMutation = useMutation({
    mutationFn: ({ id }) => deleteAnimal({ id }),
    onSuccess: (data) => {
      if (data?.statusCode === 200 || data?.details?.code === 200) {
        toast.success(data?.details?.message || "Hewan berhasil dihapus");
        queryClient.invalidateQueries({ queryKey: ["getShelterAnimals"] });
        successAction?.();
      } else {
        toast.error("Gagal menghapus hewan", {
          description: data?.details?.message || data?.message || "Terjadi kesalahan.",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal menghapus hewan", {
        description: error?.message || "Terjadi kesalahan.",
      });
    },
  });

  return { deleteAnimalMutation };
}
