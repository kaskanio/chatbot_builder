import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { intentsApi } from './apis/intentsApi';
import { stringsApi } from './apis/stringsApi';
import { nodesApi } from './apis/nodesApi';
import { connectorsApi } from './apis/connectorsApi';
import { servicesApi } from './apis/servicesApi';
import { eventsApi } from './apis/eventsApi';
import { entitiesApi } from './apis/entitiesApi';
import { synonymsApi } from './apis/synonymsApi';
import { globalSlotsApi } from './apis/globalSlotsApi';
import { intentNodesApi } from './apis/intentNodesApi';

export const store = configureStore({
  reducer: {
    [intentsApi.reducerPath]: intentsApi.reducer,
    [stringsApi.reducerPath]: stringsApi.reducer,
    [nodesApi.reducerPath]: nodesApi.reducer,
    [connectorsApi.reducerPath]: connectorsApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [entitiesApi.reducerPath]: entitiesApi.reducer,
    [synonymsApi.reducerPath]: synonymsApi.reducer,
    [globalSlotsApi.reducerPath]: globalSlotsApi.reducer,
    [intentNodesApi.reducerPath]: intentNodesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(intentsApi.middleware)
      .concat(stringsApi.middleware)
      .concat(nodesApi.middleware)
      .concat(connectorsApi.middleware)
      .concat(servicesApi.middleware)
      .concat(eventsApi.middleware)
      .concat(entitiesApi.middleware)
      .concat(synonymsApi.middleware)
      .concat(globalSlotsApi.middleware)
      .concat(intentNodesApi.middleware);
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

export {
  useFetchServiceQuery,
  useAddServiceMutation,
  useEditServiceMutation,
  useRemoveServiceMutation,
} from './apis/servicesApi';

export {
  useFetchEventQuery,
  useAddEventMutation,
  useEditEventMutation,
  useRemoveEventMutation,
} from './apis/eventsApi';

export {
  useFetchEntitiesQuery,
  useAddEntityMutation,
  useRemoveEntityMutation,
  useEditEntityMutation,
  useAddValueMutation,
  useRemoveValueMutation,
} from './apis/entitiesApi';

export {
  useFetchSynonymsQuery,
  useAddSynonymMutation,
  useRemoveSynonymMutation,
  useEditSynonymMutation,
  useAddSynonymValueMutation,
  useRemoveSynonymValueMutation,
} from './apis/synonymsApi';

export {
  useFetchGlobalSlotsQuery,
  useAddGlobalSlotMutation,
  useRemoveGlobalSlotMutation,
  useEditGlobalSlotMutation,
} from './apis/globalSlotsApi';

export {
  useFetchIntentNodesQuery,
  useAddIntentNodeMutation,
  useUpdateIntentNodeMutation,
  useDeleteIntentNodeMutation,
} from './apis/intentNodesApi';
