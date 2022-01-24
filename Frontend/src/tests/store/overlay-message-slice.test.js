import overlayMessageSlice, { overlayMessageActions } from "../../store/overlay-message-slice";

describe("todolist-slice actions Testing", () => {
  const defaulState = { message: "testing" };
  test("setToken Testing", () => {
    expect(overlayMessageSlice.reducer(defaulState, overlayMessageActions.setOverlayMessage("newTesting"))).toEqual({
      message: "newTesting",
    });
  });

  test("clearToken Testing", () => {
    expect(overlayMessageSlice.reducer(defaulState, overlayMessageActions.clearOverlayMessage())).toEqual({
      message: null,
    });
  });
});
