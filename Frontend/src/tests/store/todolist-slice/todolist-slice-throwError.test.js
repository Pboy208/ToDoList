import { fetchData } from "../../../store/todolist-slice";

const fakeDispatch = jest.fn();

global.fetch = () => {
  return new Error();
};

describe("Thunks Testing - case throw Error", () => {
  test("fetchData Testing", async () => {
    await fetchData()(fakeDispatch);
    expect(fakeDispatch).toBeCalledWith({
      payload: "Undetected error occured, please try again",
      type: "overlayMessage/setOverlayMessage",
    });
  });
});
