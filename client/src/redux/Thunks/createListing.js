import { createAsyncThunk } from "@reduxjs/toolkit";

export const createListingThunk = createAsyncThunk(
  "listing/createListing",
  async (formData) => {
    try {
      const response = await fetch(`/api/listing/createListing`, {
        method: "POST",
        body: formData,
      });

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
