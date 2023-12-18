import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteListingThunk = createAsyncThunk(
  "listing/deleteListing",
  async (ids) => {
    try {
      const response = await fetch(
        `/api/listing/deleteListing/${ids.listingId}/${ids.userId}`,
        {
          method: "DELETE",
        }
      );

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
