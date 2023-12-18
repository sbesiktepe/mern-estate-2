import { createSlice } from "@reduxjs/toolkit";
import { createListingThunk } from "../Thunks/createListing";
import { showListingThunk } from "../Thunks/showListing";
import { showUserListingsThunk } from "../Thunks/showUserListings";
import { deleteListingThunk } from "../Thunks/deleteListing";
import { updateListingThunk } from "../Thunks/updateListing";

const initialState = {
  listing: {
    isCreatedListingId: null,
    listing: null,
    userListings: null,
    searchedListing: null,
  },
};

const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    resetIsCreatedListingId(state) {
      state.listing.isCreatedListingId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createListingThunk.fulfilled, (state, action) => {
      state.listing.isCreatedListingId = action.payload.newListing._id;
      state.listing.userListings &&
        state.listing.userListings.push(action.payload.newListing);
    });

    builder.addCase(showListingThunk.fulfilled, (state, action) => {
      state.listing.listing = action.payload.message;
    });

    builder.addCase(showUserListingsThunk.fulfilled, (state, action) => {
      state.listing.userListings = action.payload.message;
    });

    builder.addCase(deleteListingThunk.fulfilled, (state, action) => {
      state.listing.userListings = state.listing.userListings.filter(
        (userListing) => userListing._id !== action.payload.message
      );
    });
    builder.addCase(updateListingThunk.fulfilled, (state, action) => {
      state.listing.listing = action.payload.message;
    });
  },
});

export const { resetIsCreatedListingId } = listingSlice.actions;

export const listingReducer = listingSlice.reducer;
