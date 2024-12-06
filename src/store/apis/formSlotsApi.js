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
      fetchFormSlotByName: builder.query({
        query: (name) => ({
          url: `/formSlots?name=${name}`,
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
        async queryFn({ name }, _queryApi, _extraOptions, fetchWithBQ) {
          // Fetch the form slot by name
          const formSlotResult = await fetchWithBQ(`/formSlots?name=${name}`);
          if (formSlotResult.error) {
            return { error: formSlotResult.error };
          }

          const formSlot = formSlotResult.data[0];
          if (!formSlot) {
            return { error: { status: 404, statusText: 'FormSlot not found' } };
          }

          // Delete the form slot by id
          const deleteResult = await fetchWithBQ({
            url: `/formSlots/${formSlot.id}`,
            method: 'DELETE',
          });

          if (deleteResult.error) {
            return { error: deleteResult.error };
          }

          return { data: deleteResult.data };
        },
      }),
    };
  },
});

export const {
  useFetchFormSlotsQuery,
  useFetchFormSlotByNameQuery,
  useAddFormSlotMutation,
  useEditFormSlotMutation,
  useRemoveFormSlotMutation,
} = formSlotsApi;

export { formSlotsApi };
