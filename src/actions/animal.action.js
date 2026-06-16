"use server";

import request, { handleAxiosError } from "@/utils/baseRequest";

export async function getShelterAnimals({ token }) {
  try {
    const response = await request.get("/animalshelter/shelter", { token });
    return {
      message: "Shelter animals successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function getAnimalDetails({ id, token }) {
  try {
    const response = await request.get(`/animalshelter/${id}`, { token });
    return {
      message: "Animal detail successfully retrieved",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function addAnimal({ body, token }) {
  try {
    const response = await request({
      method: "post",
      url: "/shelter/add",
      data: body,
      token,
    });
    return {
      message: "Animal successfully added",
      details: response.data,
      statusCode: 201,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function editAnimal({ id, body, token }) {
  try {
    const response = await request({
      method: "patch",
      url: `/shelter/edit/${id}`,
      data: body,
      token,
    });
    return {
      message: "Animal successfully updated",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function deleteAnimal({ id, token }) {
  try {
    const response = await request.delete(`/shelter/delete/${id}`, { token });
    return {
      message: "Animal successfully deleted",
      details: response.data,
      statusCode: 200,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}
