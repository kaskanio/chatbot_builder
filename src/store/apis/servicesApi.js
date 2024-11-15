import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const servicesApi = createApi({
  reducerPath: 'services',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchService: builder.query({
        providesTags: ['Service'],
        query: () => {
          return {
            url: '/services',
            method: 'GET',
          };
        },
      }),
      addService: builder.mutation({
        invalidatesTags: ['Service'],
        query: ({ name, verb, host, port, path }) => {
          return {
            url: '/services',
            method: 'POST',
            body: { name: name, verb, host, port, path }, // Include customId in the body
          };
        },
      }),
      editService: builder.mutation({
        invalidatesTags: ['Service'],
        query: ({ id, newName, verb, host, port, path }) => {
          return {
            url: `/services/${id}`,
            method: 'PATCH',
            body: { name: newName, verb, host, port, path },
          };
        },
      }),
      removeService: builder.mutation({
        invalidatesTags: ['Service'],
        query: ({ id }) => {
          return {
            url: `/services/${id}`,
            method: 'DELETE',
          };
        },
      }),
    };
  },
});

export const {
  useFetchServiceQuery,
  useAddServiceMutation,
  useEditServiceMutation,
  useRemoveServiceMutation,
} = servicesApi;
export { servicesApi };
