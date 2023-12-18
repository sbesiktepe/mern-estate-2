import { createAsyncThunk } from "@reduxjs/toolkit";

export const showUserListingsThunk = createAsyncThunk(
  "listing/showUserListings",
  async (id) => {
    try {
      const response = await fetch(`/api/listing/showUserListings/${id}`);

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
