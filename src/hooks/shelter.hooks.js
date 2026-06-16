import { fetch } from "@/utils/baseFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import {
  getShelter,
  createShelter,
  getShelterProfile,
  updateShelterProfile,
  getShelterOrders,
  confirmOrder,
  fillOrderForm,
  createOrder,
  loginShelter,
  registerShelter,
  forgotPasswordShelter,
} from "@/actions/shelter.action";

// ============ SHELTER QUERIES ============
export function useGetShelter() {
  const { data, isLoading, isPending, refetch } = useQuery({
    queryKey: ["getShelter"],
    queryFn: () => getShelter(),
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Gagal memuat shelter", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  const shelter = useMemo(() => {
    if (data?.statusCode === 200 && data?.details?.code === 200) {
      return data.details.data;
    }
    return data?.details;
  }, [data]);

  return {
    shelter,
    isLoading,
    isPending,
    refetch,
  };
}

// ============ SHELTER PROFILE QUERIES ============
export function useGetShelterProfile() {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getShelterProfile"],
    queryFn: () => getShelterProfile({ token: user?.token }),
    retry: false,
    staleTime: 0,
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    refetchOnMount: true,
    refetchOnWindowFocus: "stale",
    enabled: !!user?.token, // Only run query if user has token
    onError: (error) => {
      console.error("🔴 Query error for getShelterProfile:", error);
      toast.error("Gagal memuat profil shelter", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  const profile = useMemo(() => {
    console.log("📊 useGetShelterProfile - raw response:", data);
    const userInfo = data?.details; // Contains email, nama, etc from root
    const shelterInfo = data?.details?.shelterAcc; // Contains shelter-specific fields
    console.log("📊 useGetShelterProfile - userInfo:", userInfo);
    console.log("📊 useGetShelterProfile - shelterInfo:", shelterInfo);
    
    // Merge both objects for easy access in component
    const merged = {
      ...userInfo,
      shelterAcc: shelterInfo,
    };
    console.log("📊 useGetShelterProfile - returning merged:", merged);
    return merged;
  }, [data]);

  return {
    profile,
    isLoading,
    refetch,
  };
}

// ============ SHELTER ORDERS QUERIES ============
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
    return [];
  }, [data]);

  return {
    orders,
    isLoading,
    refetch,
  };
}

// ============ SHELTER MUTATIONS ============
export function useCreateShelterMutation({ successAction }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: ({ payload }) => {
      if (!user?.token) {
        return Promise.reject(new Error("Token tidak ditemukan. Silakan login ulang."));
      }
      return createShelter({ body: payload, token: user.token });
    },
    onSuccess: (data) => {
      if (data?.statusCode === 201 || data?.details?.code === 201) {
        toast.success(data?.details?.message || "Shelter berhasil dibuat");
        // Invalidate both queries so data is fresh when user navigates
        queryClient.invalidateQueries({ queryKey: ["getShelter"] });
        queryClient.invalidateQueries({ queryKey: ["getShelterProfile"] });
        successAction?.();
      } else {
        toast.error("Gagal membuat shelter", {
          description: data?.details?.message || data?.message,
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal membuat shelter", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}

export function useUpdateShelterProfileMutation({ successAction }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: ({ payload }) => updateShelterProfile({ body: payload, token: user?.token }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Profil berhasil diperbarui");
        queryClient.invalidateQueries({ queryKey: ["getShelterProfile"] });
        successAction?.();
      } else {
        toast.error("Gagal memperbarui profil", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal memperbarui profil", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}

// ============ ORDER MUTATIONS ============
export function useConfirmOrderMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => confirmOrder({ id, body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Pesanan berhasil dikonfirmasi");
        queryClient.invalidateQueries({ queryKey: ["getShelterOrders"] });
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

export function useFillOrderFormMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => fillOrderForm({ id, body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Form pesanan berhasil diisi");
        queryClient.invalidateQueries({ queryKey: ["getShelterOrders"] });
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

export function useCreateOrderMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }) => createOrder({ id }),
    onSuccess: (data) => {
      if (data?.statusCode === 201) {
        toast.success(data?.message || "Pesanan berhasil dibuat");
        queryClient.invalidateQueries({ queryKey: ["getShelterOrders"] });
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

// ============ AUTH MUTATIONS ============
export function useRegisterShelterMutation({ successAction }) {
  const mutation = useMutation({
    mutationFn: ({ payload }) => registerShelter({ body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 201) {
        toast.success(data?.message || "Registrasi berhasil");
        successAction?.();
      } else {
        toast.error("Gagal registrasi", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal registrasi", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}

export function useLoginShelterMutation({ successAction }) {
  const mutation = useMutation({
    mutationFn: ({ payload }) => loginShelter({ body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Login berhasil");
        // Store token if provided
        if (data?.details?.token) {
          if (typeof window !== "undefined") {
            const user = JSON.parse(window.localStorage.getItem("auth_user") || "{}");
            user.token = data.details.token;
            window.localStorage.setItem("auth_user", JSON.stringify(user));
          }
        }
        successAction?.();
      } else {
        toast.error("Gagal login", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal login", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}

export function useForgotPasswordShelterMutation({ successAction }) {
  const mutation = useMutation({
    mutationFn: ({ payload }) => forgotPasswordShelter({ body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Email reset telah dikirim");
        successAction?.();
      } else {
        toast.error("Gagal mengirim email reset", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal mengirim email reset", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}
