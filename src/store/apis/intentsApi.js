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

const entitiesApi = createApi({
  reducerPath: 'entities',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchEntities: builder.query({
        providesTags: ['Entity'],
        query: () => ({
          url: '/entities',
          method: 'GET',
        }),
      }),
      addEntity: builder.mutation({
        invalidatesTags: ['Entity'],
        query: (body) => ({
          url: '/entities',
          method: 'POST',
          body: { name: body, values: [] }, // Initialize values as an empty array
        }),
      }),
      editEntity: builder.mutation({
        invalidatesTags: ['Entity'],
        query: ({ id, newName }) => ({
          url: `/entities/${id}`,
          method: 'PATCH',
          body: { name: newName },
        }),
      }),
      removeEntity: builder.mutation({
        invalidatesTags: ['Entity'],
        query: (entity) => ({
          url: `/entities/${entity.id}`,
          method: 'DELETE',
        }),
      }),
      addValue: builder.mutation({
        invalidatesTags: ['Entity'],
        query: ({ entityId, value }) => ({
          url: `/entities/${entityId}/values`,
          method: 'POST',
          body: { value },
        }),
      }),
      removeValue: builder.mutation({
        invalidatesTags: ['Entity'],
        query: ({ entityId, value }) => ({
          url: `/entities/${entityId}/values`,
          method: 'DELETE',
          body: { value },
        }),
      }),
      editValue: builder.mutation({
        invalidatesTags: ['Entity'],
        query: ({ entityId, oldValue, newValue }) => ({
          url: `/entities/${entityId}/values`,
          method: 'PATCH',
          body: { oldValue, newValue },
        }),
      }),
    };
  },
});

export const {
  useFetchEntitiesQuery,
  useAddEntityMutation,
  useRemoveEntityMutation,
  useEditEntityMutation,
  useAddValueMutation,
  useRemoveValueMutation,
  useEditValueMutation,
} = entitiesApi;
export { entitiesApi };
