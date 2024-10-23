import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const stringsApi = createApi({
  reducerPath: 'strings',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchString: builder.query({
        providesTags: (result, error, intent) => {
          const tags = result.map((string) => {
            return { type: 'String', id: string.id };
          });
          tags.push({ type: 'IntentsString', id: intent.id });
          return tags;
        },
        query: (intent) => {
          return {
            url: '/strings',
            params: {
              intentId: intent.id,
            },
            method: 'GET',
          };
        },
      }),
      fetchAllStrings: builder.query({
        providesTags: ['Strings'],
        query: () => {
          return {
            url: '/strings',
            method: 'GET',
          };
        },
      }),
      addString: builder.mutation({
        invalidatesTags: (result, error, intent) => {
          return [{ type: 'IntentsString', id: intent.id }, 'Strings'];
        },
        query: ({ intent, newStringName }) => {
          return {
            url: '/strings',
            method: 'POST',
            body: {
              name: newStringName,
              intentId: intent.id,
              intentName: intent.name,
            },
          };
        },
      }),
      removeString: builder.mutation({
        invalidatesTags: (result, error, string) => {
          return [{ type: 'String', id: string.id }, 'Strings'];
        },
        query: (stringId) => {
          return {
            url: `/strings/${stringId}`,
            method: 'DELETE',
          };
        },
      }),
      editString: builder.mutation({
        invalidatesTags: (result, error, string) => {
          return [{ type: 'String', id: string.id }, 'Strings'];
        },
        query: ({ stringId, newName }) => {
          return {
            url: `/strings/${stringId}`,
            method: 'PATCH',
            body: {
              name: newName,
            },
          };
        },
      }),
    };
  },
});

export const {
  useFetchStringQuery,
  useFetchAllStringsQuery,
  useAddStringMutation,
  useRemoveStringMutation,
  useEditStringMutation,
} = stringsApi;
export { stringsApi };
