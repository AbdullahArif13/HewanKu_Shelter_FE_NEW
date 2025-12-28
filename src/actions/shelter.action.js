"use server";

import request, { handleAxiosError } from "@/utils/baseRequest";

export async function getShelter({ id }) {
  try {
    const response = await request({
      method: "get",
      url: `/shelter/view/${id}`,
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

export async function createShelter({ id, body }) {
  try {
    const res = await request({
      method: "post",
      url: `/shelter/create/${id}`,
      data: body,
    });
    return {
      message: "Shelter successfully created",
      details: res.data,
      statusCode: 201,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}
