"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  login as loginAction,
  register as registerAction,
  forgotPassword as forgotPasswordAction,
  verifyOTP as verifyOTPAction,
  changePass as changePassAction,
} from "@/actions/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const getTokenFromResponse = (value, depth = 3) => {
    if (!value || typeof value !== "object") return null;

    const keys = [
      "token",
      "accessToken",
      "authToken",
      "access_token",
      "bearerToken",
    ];

    for (const key of Object.keys(value)) {
      if (keys.includes(key)) {
        return value[key];
      }
    }

    if (depth <= 0) return null;

    for (const nested of Object.values(value)) {
      if (typeof nested === "object" && nested !== null) {
        const token = getTokenFromResponse(nested, depth - 1);
        if (token) return token;
      }
    }

    return null;
  };

  const normalizeUserObject = (user) => {
    if (!user || typeof user !== "object") return user;

    const normalized = { ...user };
    if (!normalized.id && normalized._id) {
      normalized.id = normalized._id;
    }

    if (!normalized.id && normalized.data?.id) {
      normalized.id = normalized.data.id;
    }

    if (!normalized.id && normalized.details?.id) {
      normalized.id = normalized.details.id;
    }

    if (!normalized.token) {
      const token = getTokenFromResponse(normalized, 4);
      if (token) normalized.token = token;
    }

    return normalized;
  };

  const login = async ({ body }) => {
    setIsLoading(true);
    try {
      const res = await loginAction({ body });

      if (res?.code !== 200) {
        toast.error(res?.message || "Login failed");
        return;
      }

      const persistedUser = normalizeUserObject(res?.data || res?.details || res);
      setUser(persistedUser);
      localStorage.setItem("auth_user", JSON.stringify(persistedUser)); // 🔐 PERSIST
      router.push("/home");
    } catch (error) {
      toast.error(error?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    router.push("/auth/login");
  };

  const register = async (payload) => {
    try {
      const res = await registerAction({ body: payload });

      if (res?.code === 201) {
        toast.success("Register berhasil, silakan login");
        return { success: true };
      }

      toast.error(res?.message || "Register failed");
      return { success: false };
    } catch (error) {
      toast.error(error?.message || "Register failed");
      return { success: false };
    }
  };

  const forgotPassword = async (data) => {
    setIsLoading(true);

    try {
      const res = await forgotPasswordAction({ body: data });

      if (res?.code >= 200 && res?.code < 300) {
        toast.success(res?.message || "OTP berhasil dikirim");
        return { success: true, message: res?.message || "OTP sent" };
      }

      toast.error(res?.message || "Send OTP failed");
      return {
        success: false,
        statusCode: res?.code,
        message: res?.message || "Send OTP failed",
      };
    } catch (error) {
      toast.error(error?.message || "Send OTP failed");
      return { success: false, message: error?.message || "Send OTP failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (data) => {
    setIsLoading(true);

    try {
      const res = await verifyOTPAction({ body: data });
      if (res?.code >= 200 && res?.code < 300) {
        toast.success(res?.message || "OTP berhasil diverifikasi");
        return { success: true, message: res?.message || "Verified" };
      }

      toast.error(res?.message || "Verify OTP failed");
      return {
        success: false,
        statusCode: res?.code,
        message: res?.message || "Verify OTP failed",
      };
    } catch (error) {
      toast.error(error?.message || "Verify OTP failed");
      return { success: false, message: error?.message || "Verify OTP failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const changePass = async (data) => {
    setIsLoading(true);

    try {
      const res = await changePassAction({ body: data });
      if (res?.code >= 200 && res?.code < 300) {
        toast.success(res?.message || "Password berhasil diubah");
        return { success: true, message: res?.message };
      }

      toast.error(res?.message || "Change password failed");
      return {
        success: false,
        statusCode: res?.code,
        message: res?.message || "Change password failed",
      };
    } catch (error) {
      toast.error(error?.message || "Change password failed");
      return {
        success: false,
        message: error?.message || "Change password failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const authState = {
    user,
    isLoading,
    login,
    logout,
    register,
    forgotPassword,
    verifyOTP,
    changePass,
  };

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
