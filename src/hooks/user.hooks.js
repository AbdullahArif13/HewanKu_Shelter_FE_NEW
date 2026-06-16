import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  createUserOrder,
  fillUserOrderForm,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  loginUser,
  registerUser,
  forgotPasswordUser,
} from "@/actions/user.action";

// ============ USER PROFILE QUERIES ============
export function useGetUserProfile() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getUserProfile"],
    queryFn: () => getUserProfile(),
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Gagal memuat profil", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  const profile = useMemo(() => data?.details, [data]);

  return {
    profile,
    isLoading,
    refetch,
  };
}

// ============ USER ORDERS QUERIES ============
export function useGetUserOrders() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getUserOrders"],
    queryFn: () => getUserOrders(),
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

// ============ USER FAVORITES QUERIES ============
export function useGetUserFavorites() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getUserFavorites"],
    queryFn: () => getUserFavorites(),
    retry: false,
    staleTime: 300000,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Gagal memuat favorit", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  const favorites = useMemo(() => {
    const payload = data?.details;
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.items)) return payload.items;
    return [];
  }, [data]);

  return {
    favorites,
    isLoading,
    refetch,
  };
}

// ============ USER PROFILE MUTATIONS ============
export function useUpdateUserProfileMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ payload }) => updateUserProfile({ body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Profil berhasil diperbarui");
        queryClient.invalidateQueries({ queryKey: ["getUserProfile"] });
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

// ============ USER ORDER MUTATIONS ============
export function useCreateUserOrderMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }) => createUserOrder({ id }),
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

export function useFillUserOrderFormMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => fillUserOrderForm({ id, body: payload }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Form pesanan berhasil diisi");
        queryClient.invalidateQueries({ queryKey: ["getUserOrders"] });
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

// ============ FAVORITES MUTATIONS ============
export function useAddToFavoritesMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ animalId }) => addToFavorites({ animalId }),
    onSuccess: (data) => {
      if (data?.statusCode === 201) {
        toast.success(data?.message || "Hewan ditambahkan ke favorit");
        queryClient.invalidateQueries({ queryKey: ["getUserFavorites"] });
        successAction?.();
      } else {
        toast.error("Gagal menambahkan favorit", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal menambahkan favorit", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}

export function useRemoveFromFavoritesMutation({ successAction }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ animalId }) => removeFromFavorites({ animalId }),
    onSuccess: (data) => {
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Hewan dihapus dari favorit");
        queryClient.invalidateQueries({ queryKey: ["getUserFavorites"] });
        successAction?.();
      } else {
        toast.error("Gagal menghapus favorit", {
          description: data?.message || "Terjadi kesalahan",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal menghapus favorit", {
        description: error?.message || "Terjadi kesalahan",
      });
    },
  });

  return mutation;
}

// ============ AUTH MUTATIONS ============
export function useRegisterUserMutation({ successAction }) {
  const mutation = useMutation({
    mutationFn: ({ payload }) => registerUser({ body: payload }),
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

export function useLoginUserMutation({ successAction }) {
  const mutation = useMutation({
    mutationFn: ({ payload }) => loginUser({ body: payload }),
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

export function useForgotPasswordUserMutation({ successAction }) {
  const mutation = useMutation({
    mutationFn: ({ payload }) => forgotPasswordUser({ body: payload }),
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
