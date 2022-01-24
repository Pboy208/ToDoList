import { createSlice } from "@reduxjs/toolkit";

const overlayMessageSlice = createSlice({
  name: "overlayMessage",
  initialState: {
    message: null,
  },
  reducers: {
    setOverlayMessage(state, action) {
      state.message = action.payload;
    },
    clearOverlayMessage(state) {
      state.message = null;
    },
  },
});

export const overlayMessageActions = overlayMessageSlice.actions;

export default overlayMessageSlice;
