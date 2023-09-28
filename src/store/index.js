import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { intentsApi } from './apis/intentsApi';
import { stringsApi } from './apis/stringsApi';

export const store = configureStore({
  reducer: {
    [intentsApi.reducerPath]: intentsApi.reducer,
    [stringsApi.reducerPath]: stringsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(intentsApi.middleware)
      .concat(stringsApi.middleware);
  },
});

setupListeners(store.dispatch);

export {
  useFetchIntentQuery,
  useAddIntentMutation,
  useRemoveIntentMutation,
  useEditIntentMutation,
} from './apis/intentsApi';

export {
  useFetchStringQuery,
  useAddStringMutation,
  useRemoveStringMutation,
  useEditStringMutation,
} from './apis/stringsApi';
