import { createAsyncThunk } from "@reduxjs/toolkit";

export const signInThunk = createAsyncThunk(
  "auth/signInUser",
  async (formData) => {
    try {
      const response = await fetch(`/api/auth/signIn`, {
        method: "POST",
        body: formData,
      });

      delay(1500);

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
