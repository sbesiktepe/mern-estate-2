import { createAsyncThunk } from "@reduxjs/toolkit";

export const oAuthThunk = createAsyncThunk("auth/oAuth", async (result) => {
  try {
    const response = await fetch(`/api/auth/oAuth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
});
