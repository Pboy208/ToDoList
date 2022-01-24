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
          ok: false,
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
      exp: Math.floor(Date.now() / 1000) + 200,
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("case renew token failed,should request with old token", async () => {
    const { result } = renderHook(() => useHttpClient());
    const sendRequest = result.current;
    await sendRequest({ url: "/any", method: "GET", body: "fakeBody", token: "fakeToken" });
    expect(mockFetch).toBeCalledWith("/any", {
      body: '"fakeBody"',
      headers: { "Content-Type": "application/json", accept: "application/json", authorization: "Bearer fakeToken" },
      method: "GET",
    });
  });
});
