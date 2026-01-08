import { api } from "./api";

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role_id: number;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => `/users`,
      providesTags: ["Users"],
    }),

    getUserById: builder.query<any, number>({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),

    createUser: builder.mutation<any, UserPayload>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<any, { id: number; body: UserPayload }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
