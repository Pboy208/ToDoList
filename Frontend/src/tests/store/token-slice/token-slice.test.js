import tokenSlice, { tokenActions } from "../../../store/token-slice";
import { checkForTokenInStorage } from "../../../store/token-slice";

const fakeDispatch = jest.fn();
jest.mock("jwt-decode", () => () => ({
  fullname: "fullname",
  email: "email",
  address: "address",
  username: "username",
  userId: "userId",
}));

global.fetch = (api, options = { method: "POST" }) => {
  switch (api) {
    case "http://localhost:3001/auths/review":
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "newFakeToken" }),
      });
    default:
      return null;
  }
};

var localStorageMock = (function () {
  return {
    getItem: function () {
      return "fakeToken";
    },
    setItem: function () {},
    removeItem: function () {},
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Thunks Testing", () => {
  test("checkForTokenInStorage Testing", async () => {
    await checkForTokenInStorage()(fakeDispatch);
    expect(fakeDispatch).toBeCalledWith({
      payload: {
        address: "address",
        email: "email",
        fullname: "fullname",
        id: "userId",
        username: "username",
      },
      type: "user/setUser",
    });
  });
});

describe("todolist-slice actions Testing", () => {
  const defaulState = { isExpired: false, isNotInStorage: false };
  test("setExpiredToken Testing", () => {
    expect(tokenSlice.reducer(defaulState, tokenActions.setExpiredToken())).toEqual({
      ...defaulState,
      isExpired: true,
    });
  });

  test("setIsNotInStorage Testing", () => {
    expect(tokenSlice.reducer(defaulState, tokenActions.setIsNotInStorage())).toEqual({
      ...defaulState,
      isNotInStorage: true,
    });
  });
  test("setTokenIsValid Testing", () => {
    expect(tokenSlice.reducer(defaulState, tokenActions.setTokenIsValid())).toEqual({
      isExpired: false,
      isNotInStorage: false,
    });
  });
});
