import { render, screen } from "@testing-library/react";
import UserInformation from "../../../components/user/UserInformation";

describe("UserInformation Testing", () => {
  test("Have a check at UserInformation.js rendering", () => {
    const user = {
      fullname: "fullname",
      username: "usernameTesting",
      addres: "address",
      email: "email",
    };
    render(<UserInformation user={user} />);

    const testingSentence = screen.getByText("usernameTesting");
    expect(testingSentence).toBeInTheDocument();
  });
});
