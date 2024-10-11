import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const globalSlotsApi = createApi({
  reducerPath: 'globalSlots',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchGlobalSlots: builder.query({
        providesTags: ['GlobalSlot'],
        query: () => ({
          url: '/globalSlots',
          method: 'GET',
        }),
      }),
      addGlobalSlot: builder.mutation({
        invalidatesTags: ['GlobalSlot'],
        query: ({ name, type, value }) => ({
          url: '/globalSlots',
          method: 'POST',
          body: { name, type, value },
        }),
      }),
      editGlobalSlot: builder.mutation({
        invalidatesTags: ['GlobalSlot'],
        query: ({ id, newName, type, value }) => ({
          url: `/globalSlots/${id}`,
          method: 'PATCH',
          body: { name: newName, type, value },
        }),
      }),
      removeGlobalSlot: builder.mutation({
        invalidatesTags: ['GlobalSlot'],
        query: ({ id }) => ({
          url: `/globalSlots/${id}`,
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  useFetchGlobalSlotsQuery,
  useAddGlobalSlotMutation,
  useEditGlobalSlotMutation,
  useRemoveGlobalSlotMutation,
} = globalSlotsApi;

export { globalSlotsApi };
