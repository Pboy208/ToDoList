import UserList from "../../../pages/user/UserList";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockSendRequest = jest.fn();
jest.mock("../../../hooks/http-hook", () => ({
  useHttpClient: () => mockSendRequest,
}));

const fakeUserList = [
  {
    id: "AXtPGRZvA56pQJfQMzoW",
    username: "phamthao",
    fullname: "Pham Phuong Thao",
    email: "thao@gmail.com",
    address: "Hanoi",
  },
  {
    id: "AXuAXTfhA56pQJfQMzpW",
    username: "thao",
    fullname: "Pham Phuong Thao",
    email: "thaobp@gmail.com",
    address: "169 Hoang Mai",
  },
  {
    id: "AXtjXPdlA56pQJfQMzor",
    username: "testingCustomHook",
    fullname: "custom hook",
    email: "ch@gmail.com",
    address: "Ha Nam",
  },
];

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

describe("UserList testing", () => {
  test("Rendering testing", async () => {
    // mockSendRequest.mockImplementation(async () => Promise.resolve({ data: fakeUserList }));
    // const { debug } = render(
    //   <MemoryRouter>
    //     <UserList />
    //   </MemoryRouter>
    // );
    // debug();
    // await waitFor(expect(screen.getByText("Pham Phuong Thao").toBeInTheDocument()));
  });
});
