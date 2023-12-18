import { createAsyncThunk } from "@reduxjs/toolkit";

export const showListingThunk = createAsyncThunk(
  "listing/showListing",
  async (id) => {
    try {
      const response = await fetch(`/api/listing/showListing/${id}`);
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
