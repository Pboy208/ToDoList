import { useHttpClient } from "../../../hooks/http-hook";
import { renderHook } from "@testing-library/react-hooks";
let mockDecodedData;
jest.mock("jwt-decode", () => {
  return () => mockDecodedData;
});

const mockFetch = jest.fn();
beforeEach(() => {
  mockFetch.mockImplementation((api, options) => {
    switch (api) {
      case "/any":
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "fakeMessage" }),
        });
      case "http://localhost:3001/auths/review":
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ token: "newToken" }),
        });
      default:
        return null;
    }
  });
});
describe("Http request custom hook Testing", () => {
  global.fetch = mockFetch;

  describe("case successfully done", () => {
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
    test("case token,body is null", async () => {
      const { result } = renderHook(() => useHttpClient());
      const sendRequest = result.current;
      const res = await sendRequest({ url: "/any", method: "GET" });
      expect(res).toEqual({ message: "fakeMessage" });
    });
    test("case token,body is valid", async () => {
      const { result } = renderHook(() => useHttpClient());
      const sendRequest = result.current;
      const res = await sendRequest({
        url: "/any",
        method: "GET",
        body: "fakeBody",
        token: "fakeToken",
      });
      expect(res).toEqual({ message: "fakeMessage" });
    });
  });

  describe("case token need to be renewed", () => {
    beforeEach(() => {
      mockDecodedData = {
        fullname: "fullname",
        email: "email",
        address: "address",
        username: "username",
        id: "userId",
        exp: Math.floor(Date.now() / 1000) + 200,
      };
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("case successfully done after token renewed", async () => {
      const { result } = renderHook(() => useHttpClient());
      const sendRequest = result.current;
      const res = await sendRequest({
        url: "/any",
        method: "GET",
        body: "fakeBody",
        token: "fakeToken",
      });
      expect(mockFetch).toBeCalledWith("/any", {
        body: '"fakeBody"',
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          authorization: "Bearer newToken",
        },
        method: "GET",
      });
      expect(res).toEqual({ message: "fakeMessage" });
    });
  });
});
