import { createAsyncThunk } from "@reduxjs/toolkit";

export const signOutThunk = createAsyncThunk("auth/signOutUser", async () => {
  try {
    const response = await fetch(`/api/auth/signOut`);

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
});

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
