import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const connectorsApi = createApi({
  reducerPath: 'connectors',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchConnector: builder.query({
        providesTagsTags: (result, error, connector) => {
          return [{ type: 'Connector', id: connector.id }];
        },
        providesTags: ['Connector'],
        query: () => {
          return {
            url: '/connectors',
            method: 'GET',
          };
        },
      }),
      addConnector: builder.mutation({
        invalidatesTags: (result, error, { id }) => {
          return [{ type: 'Connector', id }];
        },
        query: ({ connectorId, sourceId, targetId, type }) => ({
          url: '/connectors',
          method: 'POST',
          body: { id: connectorId, sourceId, targetId, type },
        }),
      }),
      updateConnector: builder.mutation({
        invalidatesTags: (result, error, { id }) => {
          return [{ type: 'Connector', id }];
        },
        query: ({ connectorId, updatedSourceId, updatedTargetId }) => {
          return {
            url: `/connectors/${connectorId}`,
            method: 'PATCH',
            body: {
              id: connectorId,
              sourceId: updatedSourceId,
              targetId: updatedTargetId,
            },
          };
        },
      }),
      deleteConnector: builder.mutation({
        invalidatesTags: (result, error, { id }) => {
          return [{ type: 'Connector', id }];
        },
        query: (connectorId) => {
          return {
            url: `/connectors/${connectorId}`,
            method: 'DELETE',
          };
        },
      }),
    };
  },
});

export const {
  useFetchConnectorQuery,
  useAddConnectorMutation,
  useUpdateConnectorMutation,
  useDeleteConnectorMutation,
} = connectorsApi;
export { connectorsApi };
