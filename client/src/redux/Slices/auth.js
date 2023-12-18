import { createSlice } from "@reduxjs/toolkit";
import { signInThunk } from "../Thunks/signInUser";
import { signOutThunk } from "../Thunks/signOutUser";
import { oAuthThunk } from "../Thunks/oAuth";
import { updateUserThunk } from "../Thunks/userUpdate";
import { deleteUserThunk } from "../Thunks/userDelete";

const initialState = {
  user: { name: null, email: null, avatar: null, id: null },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkUser: (state) => {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "userName") {
          state.user.name = decodeURIComponent(value);
        } else if (name === "userEmail") {
          state.user.email = decodeURIComponent(value);
        } else if (name === "userAvatar") {
          state.user.avatar = decodeURIComponent(value);
        } else if (name === "id") {
          const updatedValue = decodeURIComponent(value);
          const parts = updatedValue.split('"');
          state.user.id = decodeURIComponent(parts[1]);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInThunk.fulfilled, (state) => {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "userName") {
          state.user.name = decodeURIComponent(value);
        } else if (name === "userEmail") {
          state.user.email = decodeURIComponent(value);
        } else if (name === "userAvatar") {
          state.user.avatar = decodeURIComponent(value);
        } else if (name === "id") {
          const updatedValue = decodeURIComponent(value);
          const parts = updatedValue.split('"');
          state.user.id = decodeURIComponent(parts[1]);
        }
      }
    });

    builder.addCase(oAuthThunk.fulfilled, (state) => {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "userName") {
          state.user.name = decodeURIComponent(value);
        } else if (name === "userEmail") {
          state.user.email = decodeURIComponent(value);
        } else if (name === "userAvatar") {
          state.user.avatar = decodeURIComponent(value);
        } else if (name === "id") {
          const updatedValue = decodeURIComponent(value);
          const parts = updatedValue.split('"');
          state.user.id = decodeURIComponent(parts[1]);
        }
      }
    });

    builder.addCase(updateUserThunk.fulfilled, (state) => {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "userName") {
          state.user.name = decodeURIComponent(value);
        } else if (name === "userEmail") {
          state.user.email = decodeURIComponent(value);
        } else if (name === "userAvatar") {
          state.user.avatar = decodeURIComponent(value);
        } else if (name === "id") {
          const updatedValue = decodeURIComponent(value);
          const parts = updatedValue.split('"');
          state.user.id = decodeURIComponent(parts[1]);
        }
      }
    });

    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.user.name = null;
      state.user.avatar = null;
      state.user.email = null;
      state.user.id = null;
    });

    builder.addCase(deleteUserThunk.fulfilled, (state) => {
      state.user.name = null;
      state.user.avatar = null;
      state.user.email = null;
      state.user.id = null;
    });
  },
});

export const { checkUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
