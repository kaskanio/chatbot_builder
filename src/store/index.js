import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { servicesApi } from './apis/servicesApi';
import { eventsApi } from './apis/eventsApi';
import { entitiesApi } from './apis/entitiesApi';
import { synonymsApi } from './apis/synonymsApi';
import { globalSlotsApi } from './apis/globalSlotsApi';
import { formSlotsApi } from './apis/formSlotsApi';
import diagramReducer from './diagramSlice'; // Import the diagramSlice reducer

export const store = configureStore({
  reducer: {
    [servicesApi.reducerPath]: servicesApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [entitiesApi.reducerPath]: entitiesApi.reducer,
    [synonymsApi.reducerPath]: synonymsApi.reducer,
    [globalSlotsApi.reducerPath]: globalSlotsApi.reducer,
    [formSlotsApi.reducerPath]: formSlotsApi.reducer,
    diagram: diagramReducer, // Add the diagramSlice reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(servicesApi.middleware)
      .concat(eventsApi.middleware)
      .concat(entitiesApi.middleware)
      .concat(synonymsApi.middleware)
      .concat(globalSlotsApi.middleware)
      .concat(formSlotsApi.middleware);
  },
});

setupListeners(store.dispatch);

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
  useFetchFormSlotsQuery,
  useAddFormSlotMutation,
  useEditFormSlotMutation,
  useRemoveFormSlotMutation,
} from './apis/formSlotsApi';
