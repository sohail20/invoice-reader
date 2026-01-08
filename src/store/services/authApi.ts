import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

/** /auth/me response */
export interface MeResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_active: number;
  roles: string[];
}

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Me"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    /** POST /auth/login */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("token", data.access_token);
        } catch {}
      },
      invalidatesTags: ["Me"], // 🔥 refetch /auth/me after login
    }),

    /** GET /auth/me */
    getMe: builder.query<MeResponse, void>({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
} = authApi;
