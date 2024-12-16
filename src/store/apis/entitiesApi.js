import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const entitiesApi = createApi({
  reducerPath: 'entities',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001', // Ensure this matches the port your backend is running on
  }),
  endpoints(builder) {
    return {
      fetchEntities: builder.query({
        providesTags: ['Entity'],
        query: () => ({
          url: '/entities',
          method: 'GET',
        }),
      }),
      addEntity: builder.mutation({
        invalidatesTags: ['Entity'],
        query: (body) => ({
          url: '/entities',
          method: 'POST',
          body: { name: body, values: [] }, // Initialize values as an empty array
        }),
      }),
      editEntity: builder.mutation({
        invalidatesTags: ['Entity'],
        query: ({ id, newName }) => ({
          url: `/entities/${id}`,
          method: 'PATCH',
          body: { name: newName },
        }),
      }),
      removeEntity: builder.mutation({
        invalidatesTags: ['Entity'],
        query: ({ id }) => ({
          url: `/entities/${id}`,
          method: 'DELETE',
        }),
      }),
      addValue: builder.mutation({
        invalidatesTags: ['Entity'],
        query: ({ entityId, values }) => ({
          url: `/entities/${entityId}`,
          method: 'PATCH',
          body: { values },
        }),
      }),
      removeValue: builder.mutation({
        invalidatesTags: ['Entity'],
        query: ({ entityId, values }) => ({
          url: `/entities/${entityId}`,
          method: 'PATCH',
          body: { values },
        }),
      }),
    };
  },
});

export const {
  useFetchEntitiesQuery,
  useAddEntityMutation,
  useRemoveEntityMutation,
  useEditEntityMutation,
  useAddValueMutation,
  useRemoveValueMutation,
} = entitiesApi;
export { entitiesApi };
