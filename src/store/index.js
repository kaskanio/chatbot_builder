import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { intentsApi } from './apis/intentsApi';
import { stringsApi } from './apis/stringsApi';
import { nodesApi } from './apis/nodesApi';
import { connectorsApi } from './apis/connectorsApi';

export const store = configureStore({
  reducer: {
    [intentsApi.reducerPath]: intentsApi.reducer,
    [stringsApi.reducerPath]: stringsApi.reducer,
    [nodesApi.reducerPath]: nodesApi.reducer,
    [connectorsApi.reducerPath]: connectorsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(intentsApi.middleware)
      .concat(stringsApi.middleware)
      .concat(nodesApi.middleware)
      .concat(connectorsApi.middleware);
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

export {
  useFetchNodeQuery,
  useAddNodeMutation,
  useUpdateNodeMutation,
  useDeleteNodeMutation,
} from './apis/nodesApi';

export {
  useFetchConnectorQuery,
  useAddConnectorMutation,
  useUpdateConnectorMutation,
  useDeleteConnectorMutation,
} from './apis/connectorsApi';
