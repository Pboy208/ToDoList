import { checkForTokenInStorage } from "../../../store/token-slice";

const fakeDispatch = jest.fn();

global.fetch = (api, options = { method: "POST" }) => {
  switch (api) {
    case "http://localhost:3001/auths/review":
      return Promise.resolve({
        ok: true,
      });
    default:
      return null;
  }
};

describe("Thunks Testing", () => {
  test("checkForTokenInStorage Testing - case throwError", async () => {
    var localStorageMock = (function () {
      return {
        getItem: function () {
          return { token: "fakeToken" };
        },
        setItem: function () {},
        removeItem: function () {},
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

    await checkForTokenInStorage()(fakeDispatch);
    expect(fakeDispatch).toBeCalledWith({
      payload: "Undetected error occured, please try again",
      type: "overlayMessage/setOverlayMessage",
    });
  });
});
