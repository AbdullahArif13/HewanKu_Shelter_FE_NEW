"use server";

import request, { handleAxiosError } from "@/utils/baseRequest";

// ============ AUTH ENDPOINTS (Penjual/Shelter) ============
export async function registerShelter({ body }) {
  try {
    const response = await request.post("/shelter/auth/register", body);
    return {
      message: "Shelter registration successful",
      details: response.data,
      statusCode: 201,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function loginShelter({ body }) {
  try {
    const response = await request.post("/shelter/auth/login", body);
    return {
      message: "Shelter login successful",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function forgotPasswordShelter({ body }) {
  try {
    const response = await request.post("/shelter/auth/forgot", body);
    return {
      message: "Password reset email sent",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

// ============ PROFILE ENDPOINTS ============
export async function getShelterProfile({ token }) {
  try {
    console.log("🔍 Fetching /shelter/profile with token...");
    const response = await request.get("/shelter/profile", { token });
    console.log("✅ Profile response received:", response.data);
    return {
      message: "Shelter profile successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return handleAxiosError(error);
  }
}

export async function updateShelterProfile({ body, token }) {
  try {
    const response = await request({
      method: "patch",
      url: "/shelter/profile",
      data: body,
      token,
    });
    return {
      message: "Shelter profile successfully updated",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

// ============ SHELTER MANAGEMENT ENDPOINTS ============
export async function createShelter({ body, token }) {
  try {
    console.log("📤 Creating shelter with payload...");
    const res = await request({
      method: "post",
      url: "/shelter/create",
      data: body,
      token,
    });
    console.log("✅ Shelter creation response:", res.data);
    return {
      message: "Shelter successfully created",
      details: res.data,
      statusCode: 201,
    };
  } catch (error) {
    console.error("❌ Error creating shelter:", error);
    return handleAxiosError(error);
  }
}

export async function getShelter() {
  try {
    const response = await request({
      method: "get",
      url: "/shelter/view",
    });
    return {
      message: "Shelter successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function listShelters() {
  try {
    const response = await request.get("/shelter/list");
    return {
      message: "Shelters successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function updateShelter({ id, body }) {
  try {
    const response = await request({
      method: "patch",
      url: `/shelter/${id}`,
      data: body,
    });
    return {
      message: "Shelter successfully updated",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

// ============ PESANAN (ORDERS) ENDPOINTS ============
export async function getShelterOrders() {
  try {
    const response = await request.get("/pesanan/shelter/view");
    return {
      message: "Shelter orders successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function confirmOrder({ id, body }) {
  try {
    const response = await request({
      method: "patch",
      url: `/pesanan/${id}/confirm`,
      data: body,
    });
    return {
      message: "Order successfully confirmed",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function fillOrderForm({ id, body }) {
  try {
    const response = await request({
      method: "post",
      url: `/pesanan/${id}/fill`,
      data: body,
    });
    return {
      message: "Order form successfully filled",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function createOrder({ id }) {
  try {
    const response = await request({
      method: "post",
      url: `/pesanan/${id}/create`,
    });
    return {
      message: "Order successfully created",
      details: response.data,
      statusCode: 201,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}
