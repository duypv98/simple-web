import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../../../../models/User";
import fetchInterceptors from "../../utils/fetchInterceptor";

export type UserState = {
  user: { userId: string; userName: string } | null;
  userLoading: boolean;
}

const initialState: UserState = {
  user: null,
  userLoading: true
}

export const fetchMe = createAsyncThunk("user/fetchMe", async () => {
  const { success, data } = await fetchInterceptors({
    url: "/users/me",
    baseUrl: `${process.env.REACT_APP_ENDPOINT}`
  });
  if (success) return data;
  return null;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutAction: (state) => {
      state.user = null;
    },
    setUserAction: (state, action: PayloadAction<{ userId: string; userName: string } | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    const actionList = [fetchMe];
    actionList.forEach((action) => {
      builder.addCase(action.pending, (state) => {
        state.userLoading = true;
      });
    });

    builder.addCase(fetchMe.fulfilled, (state, action: PayloadAction<{ userId: string; userName: string }>) => {
      state.user = action.payload;
      state.userLoading = false;
    });
  }
});

export const { logoutAction, setUserAction } = userSlice.actions;
export default userSlice.reducer;
