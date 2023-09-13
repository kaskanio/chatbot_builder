import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// DEV ONLY!!!
// const pause = (duratiom) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, duratiom);
//   });
// };

const intentsApi = createApi({
  reducerPath: 'intents',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
    // fetchFn: async (...args) => {
    //   await pause(1000);
    //   return fetch(...args);
    // },
  }),
  endpoints(builder) {
    return {
      fetchIntent: builder.query({
        providesTags: ['Intent'],
        query: () => {
          return {
            url: '/intents',
            method: 'GET',
          };
        },
      }),
      addIntent: builder.mutation({
        invalidatesTags: ['Intent'],
        query: (body) => {
          return {
            url: '/intents',
            method: 'POST',
            body: { name: body },
          };
        },
      }),
      editIntent: builder.mutation({
        invalidatesTags: ['Intent'],
        query: ({ id, newName }) => {
          return {
            url: `/intents/${id}`,
            method: 'PATCH',
            body: { name: newName },
          };
        },
      }),
      removeIntent: builder.mutation({
        invalidatesTags: ['Intent'],
        query: (intent) => {
          return {
            url: `/intents/${intent.id}`,
            method: 'DELETE',
          };
        },
      }),
      fetchStrings: builder.query({
        providesTags: ['Strings'],
        query: (intent) => {
          return {
            url: `/intents/${intent.id}/strings`, // Use an appropriate URL structure
            method: 'GET',
          };
        },
      }),
      editString: builder.mutation({
        invalidatesTags: ['Intent'],
        query: ({ id, newStrings }) => {
          return {
            url: `/intents/${id}`,
            method: 'PATCH',
            body: { strings: newStrings },
          };
        },
      }),
      removeSting: builder.mutation({
        query: ({ id, index }) => {
          return {
            url: `intents/${id}`,
            method: 'DELETE',
          };
        },
      }),
    };
  },
});

export const {
  useFetchIntentQuery,
  useAddIntentMutation,
  useRemoveIntentMutation,
  useEditIntentMutation,
  useFetchStringsQuery,
  useEditStringMutation,
  useRemoveStingMutation,
} = intentsApi;
export { intentsApi };
