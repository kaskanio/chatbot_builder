import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const nodesApi = createApi({
  reducerPath: 'nodes',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchNode: builder.query({
        providesTagsTags: (result, error, node) => {
          return [{ type: 'Node', id: node.id }];
        },
        providesTags: ['Node'],
        query: () => {
          return {
            url: '/nodes',
            method: 'GET',
          };
        },
      }),
      addNode: builder.mutation({
        invalidatesTags: (result, error, { id }) => {
          return [{ type: 'Node', id }];
        },
        query: ({ nodeId, shape, width, height }) => ({
          url: '/nodes',
          method: 'POST',
          body: { id: nodeId, shape: shape, width: width, height: height },
        }),
      }),
      updateNode: builder.mutation({
        invalidatesTags: (result, error, { id }) => {
          return [{ type: 'Node', id }];
        },
        query: ({
          nodeId,
          updatedOffsetX,
          updatedOffsetY,
          updatedWidth,
          updatedHeight,
        }) => {
          return {
            url: `/nodes/${nodeId}`,
            method: 'PATCH',
            body: {
              id: nodeId,
              offsetX: updatedOffsetX,
              offsetY: updatedOffsetY,
              width: updatedWidth,
              height: updatedHeight,
            },
          };
        },
      }),
    };
  },
});

export const { useFetchNodeQuery, useAddNodeMutation, useUpdateNodeMutation } =
  nodesApi;
export { nodesApi };
