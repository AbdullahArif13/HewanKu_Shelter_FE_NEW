import { fetch } from "@/utils/baseFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { getShelter, createShelter } from "@/actions/shelter.action";

export function useGetShelter({ id }) {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ["getShelter", id],
    queryFn: () => getShelter({ id }),
    enabled: Boolean(id),
    retry: false,
    staleTime: 300000, // 5 menit
    cacheTime: Infinity, // Cache tidak akan dihapus
    refetchOnMount: false, // Tidak refetch saat komponen di-mount ulang
    refetchOnWindowFocus: false, // Tidak refetch saat fokus kembali ke tab
    onError: (error) => {
      toast.error("Something went wrong!", {
        description: error.message
          ? error.message
          : "Unexpected error occurred!",
      });
    },
  });

  const shelter = useMemo(() => {
    if (data?.statusCode === 200 && data?.details?.code === 200) {
      return data.details.data;
    }
    return null;
  }, [data]);

  return {
    shelter,
    isLoading,
    isPending,
    refetch,
  };
}

export function useAddShelterMutation({ successAction }) {
  const queryClient = useQueryClient();

  const addShelterMutation = useMutation({
    mutationFn: ({ payload }) => createShelter({ body: payload }),

    onSuccess: (data) => {
      if (data?.details?.code === 201) {
        toast.success(data?.details?.message || "Shelter berhasil dibuat");
        queryClient.invalidateQueries({ queryKey: ["getShelter"] });
        successAction?.();
      } else {
        toast.error("Shelter failed to create!", {
          description: data?.details?.message || data?.message || "Error",
        });
      }
    },

    onError: (error) => {
      toast.error("Something went wrong!", {
        description: error?.message || "Unexpected error occurred",
      });
    },
  });

  return { addShelterMutation };
}
