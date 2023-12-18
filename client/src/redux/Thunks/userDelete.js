import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteUserThunk = createAsyncThunk(
  "user/deleteUser",
  async (id) => {
    try {
      const response = await fetch(`/api/user/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await delay(2000);

      const data = await response.json();

      if (!response.ok) {
        console.log();
        throw new Error(data.errorMessage.errorMessage);
      }

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
