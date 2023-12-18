import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slices/auth";
import { listingReducer } from "./Slices/listing";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingReducer,
  },
});
