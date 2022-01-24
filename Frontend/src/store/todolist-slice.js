import { overlayMessageActions } from "./overlay-message-slice";
import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";
const endPoint = "http://localhost:3000/todolist";

const clearDupplicate = (list) => {
  return list.filter(
    (task, index, self) => index === self.findIndex((otherTask) => otherTask.id === task.id)
  );
};

const todolistSlice = createSlice({
  name: "todolist",
  initialState: {
    list: [],
    nextOffset: 0,
    hasMore: true,
    offset: 0,
  },
  reducers: {
    listInitialize(state, action) {
      const list = action.payload;
      state.list = list;
    },
    addToList(state, action) {
      const newTask = action.payload;
      state.list = [newTask, ...state.list];
    },
    changeInList(state, action) {
      const modifiedTask = action.payload;
      state.list = state.list.map((task) => {
        return task.id === modifiedTask.id ? modifiedTask : task;
      });
    },
    removeFromList(state, action) {
      const removedTaskId = action.payload;
      state.list = state.list.filter((task) => {
        return task.id !== removedTaskId;
      });
    },
    setHasMore(state, action) {
      state.hasMore = action.payload;
    },
    appendList(state, action) {
      const addingTasks = action.payload;
      const newList = [...current(state).list, ...addingTasks];
      const nonDuppList = clearDupplicate(newList);
      state.list = nonDuppList;
      state.nextOffset += 1;
    },
    setOffset(state) {
      state.offset += 1;
    },
  },
});
export const todolistActions = todolistSlice.actions;

export const fetchData = (token) => {
  return async (dispatch) => {
    try {
      const res = await fetch(endPoint, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) {
        return dispatch(overlayMessageActions.setOverlayMessage(resData.message));
      }
      dispatch(todolistActions.listInitialize(resData));
    } catch (error) {
      console.log("error:::", error);
      dispatch(
        overlayMessageActions.setOverlayMessage("Undetected error occured, please try again")
      );
    }
  };
};

export default todolistSlice;
