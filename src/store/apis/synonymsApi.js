import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const synonymsApi = createApi({
  reducerPath: 'synonyms',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  endpoints(builder) {
    return {
      fetchSynonyms: builder.query({
        providesTags: ['Synonym'],
        query: () => ({
          url: '/synonyms',
          method: 'GET',
        }),
      }),
      addSynonym: builder.mutation({
        invalidatesTags: ['Synonym'],
        query: (body) => ({
          url: '/synonyms',
          method: 'POST',
          body: { name: body, values: [] }, // Initialize values as an empty array
        }),
      }),
      editSynonym: builder.mutation({
        invalidatesTags: ['Synonym'],
        query: ({ id, newName }) => ({
          url: `/synonyms/${id}`,
          method: 'PATCH',
          body: { name: newName },
        }),
      }),
      removeSynonym: builder.mutation({
        invalidatesTags: ['Synonym'],
        query: (synonym) => ({
          url: `/synonyms/${synonym.id}`,
          method: 'DELETE',
        }),
      }),
      addSynonymValue: builder.mutation({
        invalidatesTags: ['Synonym'],
        query: ({ synonymId, values }) => ({
          url: `/synonyms/${synonymId}`,
          method: 'PATCH',
          body: { values },
        }),
      }),
      removeSynonymValue: builder.mutation({
        invalidatesTags: ['Synonym'],
        query: ({ synonymId, values }) => ({
          url: `/synonyms/${synonymId}`,
          method: 'PATCH',
          body: { values },
        }),
      }),
    };
  },
});

export const {
  useFetchSynonymsQuery,
  useAddSynonymMutation,
  useRemoveSynonymMutation,
  useEditSynonymMutation,
  useAddSynonymValueMutation,
  useRemoveSynonymValueMutation,
} = synonymsApi;
export { synonymsApi };
