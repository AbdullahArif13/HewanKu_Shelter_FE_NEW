import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  getShelterOrders,
  getUserOrders,
  confirmOrder,
  fillOrderForm,
  createOrder,
  getOrderDetails,
  cancelOrder,
} from "@/actions/pesanan.action";

// ============ SHELTER ORDERS ============
export function useGetShelterOrders() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getShelterOrders"],
    queryFn: () => getShelterOrders(),
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Gagal memuat pesanan", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  const orders = useMemo(() => {
    const payload = data?.details;
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.orders)) return payload.orders;
    return [];
  }, [data]);

  return {
    orders,
    isLoading,
    refetch,
  };
}

// ============ USER ORDERS ============
export function useGetUserOrders() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getUserOrders"],
    queryFn: () => getUserOrders(),
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Gagal memuat pesanan Anda", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  const orders = useMemo(() => {
    const payload = data?.details;
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.orders)) return payload.orders;
    return [];
  }, [data]);

  return {
    orders,
    isLoading,
    refetch,
  };
}

// ============ ORDER DETAILS ============
export function useGetOrderDetails({ id }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getOrderDetails", id],
    queryFn: () => getOrderDetails({ id }),
    enabled: Boolean(id),
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Gagal memuat detail pesanan", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  const order = useMemo(() => data?.details, [data]);

  return {
    order,
    isLoading,
    refetch,
  };
}

// ============ CONFIRM ORDER (Shelter) ============
export function useConfirmOrderMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }) =>
      confirmOrder({
        id,
        body: { status },
      }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Pesanan berhasil dikonfirmasi");
        queryClient.invalidateQueries({ queryKey: ["getShelterOrders"] });
        queryClient.invalidateQueries({ queryKey: ["getOrderDetails"] });
        successAction?.();
      } else {
        toast.error("Gagal mengkonfirmasi pesanan", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal mengkonfirmasi pesanan", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}

// ============ FILL ORDER FORM (User) ============
export function useFillOrderFormMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => fillOrderForm({ id, body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Form pesanan berhasil diisi");
        queryClient.invalidateQueries({ queryKey: ["getUserOrders"] });
        queryClient.invalidateQueries({ queryKey: ["getOrderDetails"] });
        successAction?.();
      } else {
        toast.error("Gagal mengisi form pesanan", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal mengisi form pesanan", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}

// ============ CREATE ORDER (User) ============
export function useCreateOrderMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ animalId }) => createOrder({ animalId }),
    onSuccess: (data) => {
      if (data?.statusCode === 201) {
        toast.success(data?.message || "Pesanan berhasil dibuat");
        queryClient.invalidateQueries({ queryKey: ["getUserOrders"] });
        successAction?.();
      } else {
        toast.error("Gagal membuat pesanan", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal membuat pesanan", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}

// ============ CANCEL ORDER ============
export function useCancelOrderMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }) => cancelOrder({ id }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Pesanan berhasil dibatalkan");
        queryClient.invalidateQueries({ queryKey: ["getShelterOrders"] });
        queryClient.invalidateQueries({ queryKey: ["getUserOrders"] });
        queryClient.invalidateQueries({ queryKey: ["getOrderDetails"] });
        successAction?.();
      } else {
        toast.error("Gagal membatalkan pesanan", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal membatalkan pesanan", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}
