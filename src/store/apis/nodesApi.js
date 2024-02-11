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
        query: ({
          nodeId,
          shape,
          type,
          width,
          height,
          addInfo,
          activity,
          taskType,
        }) => ({
          url: '/nodes',
          method: 'POST',
          body: {
            id: nodeId,
            shape: shape,
            type: type,
            width: width,
            height: height,
            activity: activity,
            taskType: taskType,
            addInfo: addInfo,
          },
        }),
      }),
      updateNode: builder.mutation({
        invalidatesTags: ['Node'],

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
      deleteNode: builder.mutation({
        invalidatesTags: ['Node'],

        query: (nodeId) => {
          return {
            url: `/nodes/${nodeId}`,
            method: 'DELETE',
          };
        },
      }),
    };
  },
});

export const {
  useFetchNodeQuery,
  useAddNodeMutation,
  useUpdateNodeMutation,
  useDeleteNodeMutation,
} = nodesApi;
export { nodesApi };
