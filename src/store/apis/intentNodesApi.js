import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const intentNodesApi = createApi({
  reducerPath: 'intentNodes',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchIntentNodes: builder.query({
        providesTags: ['IntentNode'],
        query: () => ({
          url: '/intentNodes',
          method: 'GET',
        }),
      }),
      addIntentNode: builder.mutation({
        invalidatesTags: ['IntentNode'],
        query: ({ nodeId, classShapeName, attributes, offsetX, offsetY }) => ({
          url: '/intentNodes',
          method: 'POST',
          body: {
            id: nodeId,
            shape: {
              type: 'UmlClassifier',
              classShape: {
                name: classShapeName,
                attributes: attributes.map((attr) => ({
                  type: 'string',
                  name: attr,
                })),
              },
              classifier: 'Class',
            },
          },
        }),
      }),
      updateIntentNode: builder.mutation({
        invalidatesTags: ['IntentNode'],
        query: ({
          nodeId,
          updatedOffsetX,
          updatedOffsetY,
          updatedWidth,
          updatedHeight,
        }) => ({
          url: `/intentNodes/${nodeId}`,
          method: 'PATCH',
          body: {
            id: nodeId,
            offsetX: updatedOffsetX,
            offsetY: updatedOffsetY,
            width: updatedWidth,
            height: updatedHeight,
          },
        }),
      }),
      deleteIntentNode: builder.mutation({
        invalidatesTags: ['IntentNode'],
        query: (nodeId) => ({
          url: `/intentNodes/${nodeId}`,
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  useFetchIntentNodesQuery,
  useAddIntentNodeMutation,
  useUpdateIntentNodeMutation,
  useDeleteIntentNodeMutation,
} = intentNodesApi;
export { intentNodesApi };
