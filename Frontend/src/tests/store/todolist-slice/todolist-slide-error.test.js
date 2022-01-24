import { fetchData } from "../../../store/todolist-slice";

const fakeDispatch = jest.fn();

describe("Thunks Testing - case res.ok = false", () => {
  global.fetch = (api, options = { method: "POST" }) => {
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: "errorMessage" }),
    });
  };

  test("fetchData Testing", async () => {
    await fetchData()(fakeDispatch);
    expect(fakeDispatch).toBeCalledWith({
      payload: "errorMessage",
      type: "overlayMessage/setOverlayMessage",
    });
  });
});
