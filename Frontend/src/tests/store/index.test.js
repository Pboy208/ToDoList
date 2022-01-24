import store from "../../store";

jest.mock("@reduxjs/toolkit", () => ({
  ...jest.requireActual("@reduxjs/toolkit"),
  configureStore: (reducers) => reducers,
}));

jest.mock("../../store/overlay-message-slice", () => ({
  reducer: "fakeReducer",
}));

jest.mock("../../store/user-slice", () => ({
  reducer: "fakeReducer",
}));

jest.mock("../../store/token-slice", () => ({
  reducer: "fakeReducer",
}));

jest.mock("../../store/todolist-slice", () => ({
  reducer: "fakeReducer",
}));

describe("store testing", () => {
  test("store config testing", () => {
    expect(store).toMatchObject({
      reducer: {
        overlayMessage: "fakeReducer",
        toDoList: "fakeReducer",
        token: "fakeReducer",
        user: "fakeReducer",
      },
    });
  });
});
