import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async (formData) => {
    try {
      const response = await fetch(
        `/api/user/updateUser/${formData.get("id")}`,
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
          body: formData,
        }
      );

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
