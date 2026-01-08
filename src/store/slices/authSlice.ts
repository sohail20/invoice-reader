import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  roles: string[];
}

const initialState: AuthState = {
  token: null,
  roles: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; roles: string[] }>
    ) => {
      state.token = action.payload.token;
      state.roles = action.payload.roles;
    },
    logout: (state) => {
      state.token = null;
      state.roles = [];
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
