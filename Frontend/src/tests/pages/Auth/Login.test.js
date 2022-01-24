import { expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../../pages/auth/Login";
import { mockHistoryPush } from "../../../setupTests";

const mockSendRequest = jest.fn();
jest.mock("../../../hooks/http-hook", () => ({
  useHttpClient: () => mockSendRequest,
}));

jest.mock("jwt-decode", () => {
  return () => ({
    fullname: "fullname",
    email: "email",
    address: "address",
    username: "username",
    id: "userId",
  });
});

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

describe("Login Testing", () => {
  describe("Succesfully done", () => {
    beforeEach(() => {
      mockSendRequest.mockImplementation(async () => Promise.resolve({ token: "fakeToken" }));
    });
    test("Login page rendering testing", () => {
      render(<Login />);

      const text = screen.getByText("Login Required");

      const inputElements = screen.getAllByRole("textbox");

      expect(text).toBeInTheDocument();

      for (let input of inputElements) {
        expect(input.value).toEqual("");
      }
    });

    test("Change input testing", () => {
      render(<Login />);

      const inputElements = screen.getAllByRole("textbox");

      for (let input of inputElements) {
        userEvent.type(input, "Test");
      }

      const inputElementsAfter = screen.getAllByRole("textbox");

      expect(inputElementsAfter[0].value).toEqual("Test");
    });

    test("Validation error testing", () => {
      render(<Login />);

      const loginBtn = screen.getByText("LOGIN");
      userEvent.click(loginBtn);

      expect(
        screen.getByText("Username should have length in the range of 5 to 25 characters")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Password should have length in the range of 8 to 10 characters")
      ).toBeInTheDocument();
    });

    test("Login testing", () => {
      const { container } = render(<Login />);

      const inputElements = container.querySelectorAll("input");
      for (let input of inputElements) {
        userEvent.type(input, "TestingStr");
      }

      const loginBtn = screen.getByText("LOGIN");
      userEvent.click(loginBtn);

      expect(mockSendRequest).toBeCalledWith({
        body: { password: "TestingStr", username: "TestingStr" },
        method: "POST",
        url: "http://localhost:3001/auths/login",
      });
    });

    test("ToSignUp testing", () => {
      render(<Login />);
      userEvent.click(screen.getByText("SIGN UP"));
      expect(mockHistoryPush).toBeCalledWith("/user/signup");
    });
  });

  describe("Res error", () => {
    beforeEach(() => {
      mockSendRequest.mockImplementation(async () => Promise.resolve());
    });
    test("Login page rendering testing", () => {
      const { container } = render(<Login />);

      const inputElements = container.querySelectorAll("input");
      for (let input of inputElements) {
        userEvent.type(input, "TestingStr");
      }
      const loginBtn = screen.getByText("LOGIN");

      userEvent.click(loginBtn);
      expect(mockDispatch).not.toBeCalled();
    });
  });
});
