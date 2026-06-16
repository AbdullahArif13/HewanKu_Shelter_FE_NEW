"use server";

import request, { handleAxiosError } from "@/utils/baseRequest";

// ============ PESANAN (ORDERS) ENDPOINTS ============

// Get orders from Shelter perspective
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

// Get orders from User perspective
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

// Confirm order (Diterima/Ditolak) - only for Shelter
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

// Fill order form - for User adoption process
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

// Create order - User creates order for an animal
export async function createOrder({ animalId }) {
  try {
    const response = await request({
      method: "post",
      url: `/pesanan/${animalId}/create`,
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

// Get order details by ID
export async function getOrderDetails({ id }) {
  try {
    const response = await request.get(`/pesanan/${id}`);
    return {
      message: "Order details successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

// Cancel order (if supported by backend)
export async function cancelOrder({ id }) {
  try {
    const response = await request({
      method: "patch",
      url: `/pesanan/${id}/cancel`,
    });
    return {
      message: "Order successfully cancelled",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}
