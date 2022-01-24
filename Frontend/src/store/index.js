import overlayMessageSlice from "./overlay-message-slice";
import { configureStore } from "@reduxjs/toolkit";
import toDoListSlice from "./todolist-slice";
import tokenSlice from "./token-slice";
import userSlice from "./user-slice";

const store = configureStore({
  reducer: {
    toDoList: toDoListSlice.reducer,
    overlayMessage: overlayMessageSlice.reducer,
    user: userSlice.reducer,
    token: tokenSlice.reducer,
  },
});

export default store;
