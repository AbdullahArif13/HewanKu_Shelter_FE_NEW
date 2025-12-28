"use server";

import request, { handleAxiosError } from "@/utils/baseRequest";

export async function login({ body }) {
  try {
    const res = await request.post("/shelter/login", body);
    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function logout() {
  // Karena tidak ada token/cookie yang disimpan, logout cukup noop.
  // Jika backend punya endpoint logout (mis: invalidate session), kamu bisa panggil di sini.
  return { success: true };
}

export async function register({ body }) {
  try {
    const res = await request.post("/shelter/register", body);
    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function forgotPassword({ body }) {
  try {
    const res = await request.post("/shelter/forgot", body);
    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function verifyOTP({ body }) {
  try {
    const res = await request.post("/shelter/verify", body);
    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function changePass({ body }) {
  try {
    const res = await request.post("/shelter/change", body);
    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
}
