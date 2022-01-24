import UserNotFound from "../../pages/UserNotFound";
import { render, screen } from "@testing-library/react";

describe("UserNotFound testing", () => {
  test("redering UserNotFound", () => {
    render(<UserNotFound message='Testing message' />);
    const text = screen.getByText("Testing message");
    expect(text).toBeInTheDocument();
  });
});
