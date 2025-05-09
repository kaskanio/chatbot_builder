import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  diagramData: null,
};

const diagramSlice = createSlice({
  name: 'diagram',
  initialState,
  reducers: {
    saveDiagramState: (state, action) => {
      state.diagramData = action.payload;
    },
    loadDiagramState: (state, action) => {
      state.diagramData = action.payload;
    },
  },
});

export const { saveDiagramState, loadDiagramState } = diagramSlice.actions;

export default diagramSlice.reducer;
