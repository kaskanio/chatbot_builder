import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const formSlotsApi = createApi({
  reducerPath: 'formSlots',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchFormSlots: builder.query({
        providesTags: ['FormSlot'],
        query: () => ({
          url: '/formSlots',
          method: 'GET',
        }),
      }),
      addFormSlot: builder.mutation({
        invalidatesTags: ['FormSlot'],
        query: ({ name, type, value }) => ({
          url: '/formSlots',
          method: 'POST',
          body: { name, type, value },
        }),
      }),
      editFormSlot: builder.mutation({
        invalidatesTags: ['FormSlot'],
        query: ({ id, newName, type, value }) => ({
          url: `/formSlots/${id}`,
          method: 'PATCH',
          body: { name: newName, type, value },
        }),
      }),
      removeFormSlot: builder.mutation({
        invalidatesTags: ['FormSlot'],
        query: ({ id }) => ({
          url: `/formSlots/${id}`,
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  useFetchFormSlotsQuery,
  useAddFormSlotMutation,
  useEditFormSlotMutation,
  useRemoveFormSlotMutation,
} = formSlotsApi;

export { formSlotsApi };
