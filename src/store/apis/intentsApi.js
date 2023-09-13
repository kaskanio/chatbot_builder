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
      fetchIntent: builder.query({
        providesTags: ['Intent'],
        query: () => {
          return {
            url: '/intents',
            method: 'GET',
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
} = intentsApi;
export { intentsApi };
