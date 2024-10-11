import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const eventsApi = createApi({
  reducerPath: 'events',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchEvent: builder.query({
        providesTags: ['Event'],
        query: () => {
          return {
            url: '/events',
            method: 'GET',
          };
        },
      }),
      addEvent: builder.mutation({
        invalidatesTags: ['Event'],
        query: ({ name, uri }) => {
          return {
            url: '/events',
            method: 'POST',
            body: { name, uri }, // Add event with name and URI
          };
        },
      }),
      editEvent: builder.mutation({
        invalidatesTags: ['Event'],
        query: ({ id, newName, uri }) => {
          return {
            url: `/events/${id}`,
            method: 'PATCH',
            body: { name: newName, uri }, // Update event's name and URI
          };
        },
      }),
      removeEvent: builder.mutation({
        invalidatesTags: ['Event'],
        query: ({ id }) => {
          return {
            url: `/events/${id}`,
            method: 'DELETE',
          };
        },
      }),
    };
  },
});

export const {
  useFetchEventQuery,
  useAddEventMutation,
  useEditEventMutation,
  useRemoveEventMutation,
} = eventsApi;

export { eventsApi };
