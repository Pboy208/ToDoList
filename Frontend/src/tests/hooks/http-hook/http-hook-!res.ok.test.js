import { useHttpClient } from "../../../hooks/http-hook";
import { renderHook } from "@testing-library/react-hooks";
import { mockDispatch } from "../../../setupTests";

let mockDecodedData;
jest.mock("jwt-decode", () => {
  return () => mockDecodedData;
});

const mockFetch = jest.fn();
beforeEach(() => {
  mockFetch.mockImplementation((api, options) => {
    switch (api) {
      case "/401":
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: "errorMessage" }),
        });
      case "/404":
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: "errorMessage" }),
        });
      case "/409":
        return Promise.resolve({
          ok: false,
          status: 409,
          json: () => Promise.resolve({ message: "errorMessage" }),
        });
      case "/throwError":
        return Promise.resolve({});
      case "http://localhost:3001/auths/review":
        return Promise.resolve({
          ok: true,
        });
      default:
        return null;
    }
  });
});
describe("Http request custom hook Testing", () => {
  global.fetch = mockFetch;

  beforeEach(() => {
    mockDecodedData = {
      fullname: "fullname",
      email: "email",
      address: "address",
      username: "username",
      id: "userId",
      exp: 9999999999999,
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("case respone error - !res.ok", () => {
    test("Error 401 - should dispatch token expired", async () => {
      const { result } = renderHook(() => useHttpClient());
      const sendRequest = result.current;
      await sendRequest({ url: "/401", method: "GET", body: "fakeBody", token: "fakeToken" });
      expect(mockDispatch).toBeCalledWith({ payload: undefined, type: "token/setExpiredToken" });
    });
    test("Error 404 - should dispatch notthing", async () => {
      const { result } = renderHook(() => useHttpClient());
      const sendRequest = result.current;
      await sendRequest({ url: "/404", method: "GET", body: "fakeBody", token: "fakeToken" });
      expect(mockDispatch).not.toBeCalled();
    });
    test("Error 409 - should dispatch set overlay message", async () => {
      const { result } = renderHook(() => useHttpClient());
      const sendRequest = result.current;
      await sendRequest({ url: "/409", method: "GET", body: "fakeBody", token: "fakeToken" });
      expect(mockDispatch).toBeCalledWith({ payload: "errorMessage", type: "overlayMessage/setOverlayMessage" });
    });
    test("Error in custom hook - should dispatch set overlay message", async () => {
      const { result } = renderHook(() => useHttpClient());
      const sendRequest = result.current;
      await sendRequest({ url: "/throwError", method: "GET", body: "fakeBody", token: "fakeToken" });
      expect(mockDispatch).toBeCalledWith({ payload: "Undetected error occured, please try again", type: "overlayMessage/setOverlayMessage" });
    });
  });
});
