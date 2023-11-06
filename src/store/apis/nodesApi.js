import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const nodesApi = createApi({
  reducerPath: 'nodes',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchNode: builder.query({
        providesTags: ['Node'],
        query: () => {
          return {
            url: '/nodes',
            method: 'GET',
          };
        },
      }),
      addNode: builder.mutation({
        invalidatesTags: ['Node'],
        query: (nodeName) => ({
          url: '/nodes',
          method: 'POST',
          body: { name: nodeName },
        }),
      }),
    };
  },
});

export const { useFetchNodeQuery, useAddNodeMutation } = nodesApi;
export { nodesApi };
