import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { intentsApi } from './apis/intentsApi';

export const store = configureStore({
  reducer: { [intentsApi.reducerPath]: intentsApi.reducer },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(intentsApi.middleware);
  },
});

setupListeners(store.dispatch);

export {
  useFetchIntentQuery,
  useAddIntentMutation,
  useRemoveIntentMutation,
  useEditIntentMutation,
  useFetchStringsQuery,
  useEditStringMutation,
  useRemoveStingMutation,
} from './apis/intentsApi';
