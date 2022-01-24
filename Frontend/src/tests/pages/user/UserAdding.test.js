import { render, screen } from "@testing-library/react";
import UserAdding from "../../../pages/user/UserAdding";
import userEvent from "@testing-library/user-event";

const mockSendRequest = jest.fn();
jest.mock("../../../hooks/http-hook", () => ({
  useHttpClient: () => mockSendRequest,
}));

jest.useFakeTimers();

describe("UserAdding testing", () => {
  test("Rendering testing", () => {
    render(<UserAdding />);
    expect(screen.getByText("Registing Required")).toBeInTheDocument();
  });

  test("onChange testing", () => {
    render(<UserAdding />);
    userEvent.type(screen.getAllByRole("textbox")[0], "testing");
    jest.runAllTimers();
    expect(screen.getAllByRole("textbox")[0].value).toEqual("testing");
  });

  test("submit testing", async () => {
    mockSendRequest.mockImplementation(async () => Promise.resolve("res"));
    const { container } = render(<UserAdding />);
    window.alert = jest.fn();
    const inputElements = container.querySelectorAll("input");
    for (const element of inputElements) {
      if (element.id === "email") {
        userEvent.type(element, "testingStr@gmail.com");
      } else {
        userEvent.type(element, "testingStr");
      }
    }

    const submitBtn = screen.getByText("SIGN UP");
    userEvent.click(submitBtn);

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(window.alert).toBeCalledWith("New account is succesfully added");
  });

  test("submit testing -case !res", async () => {
    mockSendRequest.mockImplementation(async () => Promise.resolve());
    const { container } = render(<UserAdding />);
    window.alert = jest.fn();
    const inputElements = container.querySelectorAll("input");
    for (const element of inputElements) {
      userEvent.type(element, "testing");
    }

    const submitBtn = screen.getByText("SIGN UP");
    userEvent.click(submitBtn);
    userEvent.click(submitBtn);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(window.alert).not.toBeCalled();
  });
});
