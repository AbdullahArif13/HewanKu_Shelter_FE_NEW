"use server";

import request, { handleAxiosError } from "@/utils/baseRequest";

// ============ AUTH ENDPOINTS (Pengguna/User) ============
export async function registerUser({ body }) {
  try {
    const response = await request.post("/pengguna/auth/register", body);
    return {
      message: "User registration successful",
      details: response.data,
      statusCode: 201,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function loginUser({ body }) {
  try {
    const response = await request.post("/pengguna/auth/login", body);
    return {
      message: "User login successful",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function forgotPasswordUser({ body }) {
  try {
    const response = await request.post("/pengguna/auth/forgot", body);
    return {
      message: "Password reset email sent",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

// ============ USER PROFILE ENDPOINTS ============
export async function getUserProfile() {
  try {
    const response = await request.get("/pengguna/profile");
    return {
      message: "User profile successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function updateUserProfile({ body }) {
  try {
    const response = await request({
      method: "patch",
      url: "/pengguna/profile",
      data: body,
    });
    return {
      message: "User profile successfully updated",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

// ============ USER ORDERS ENDPOINTS ============
export async function getUserOrders() {
  try {
    const response = await request.get("/pesanan/pengguna/view");
    return {
      message: "User orders successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function createUserOrder({ id }) {
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

export async function fillUserOrderForm({ id, body }) {
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

// ============ USER FAVORITES ENDPOINTS ============
export async function getUserFavorites() {
  try {
    const response = await request.get("/pengguna/favorites");
    return {
      message: "User favorites successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function addToFavorites({ animalId }) {
  try {
    const response = await request({
      method: "post",
      url: `/pengguna/favorites`,
      data: { animalId },
    });
    return {
      message: "Animal added to favorites",
      details: response.data,
      statusCode: 201,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function removeFromFavorites({ animalId }) {
  try {
    const response = await request({
      method: "delete",
      url: `/pengguna/favorites/${animalId}`,
    });
    return {
      message: "Animal removed from favorites",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}
