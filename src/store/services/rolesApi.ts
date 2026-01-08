import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface RoleUser {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: string;
  created_at: string;
  users?: RoleUser[];
}

export interface PaginatedRolesResponse {
  data: Role[];
  page: number;
  limit: number;
  total: number;
}

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  tagTypes: ["Roles", "Role"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    /* ===================== GET ===================== */
    getRoles: builder.query<PaginatedRolesResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => `/roles?page=${page}&limit=${limit}`,
      providesTags: ["Roles"],
    }),

    getRoleById: builder.query<Role, number>({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),

    /* ===================== CREATE ===================== */
    createRole: builder.mutation<
      Role,
      { name: string; description?: string; permissions: string }
    >({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    /* ===================== UPDATE ===================== */
    updateRole: builder.mutation<
      Role,
      { id: number; name: string; description?: string; permissions?: string, }
    >({
      query: ({ id, ...body }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Roles",
        { type: "Role", id },
      ],
    }),

    /* ===================== DELETE ===================== */
    deleteRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),

    /* ===================== ASSIGN ROLE ===================== */
    assignRoleToUser: builder.mutation<
      void,
      { role_id: number; user_id: number }
    >({
      query: ({ role_id, user_id }) => ({
        url: `/roles/${role_id}/assign`,
        method: "POST",
        body: { user_id },
      }),
      invalidatesTags: (result, error, { role_id }) => [
        { type: "Role", id: role_id },
      ],
    }),

    /* ===================== REMOVE ROLE ===================== */
    removeRoleFromUser: builder.mutation<
      void,
      { role_id: number; user_id: number }
    >({
      query: ({ role_id, user_id }) => ({
        url: `/roles/${role_id}/users/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { role_id }) => [
        { type: "Role", id: role_id },
      ],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignRoleToUserMutation,
  useRemoveRoleFromUserMutation,
} = rolesApi;
