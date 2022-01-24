import UserInputAlert from "../../../components/alert/UserInputAlert";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { mockDispatch } from "../../../setupTests";

const mockStore = configureStore([]);

describe("UserInputAlert testing", () => {
  let store = mockStore({
    overlayMessage: { message: "fakeMessage" },
  });
  store.dispatch = jest.fn();
  test("confirm btn click testing", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserInputAlert />
        </MemoryRouter>
      </Provider>
    );
    const btn = screen.getByRole("button");
    userEvent.click(btn);
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: "overlayMessage/clearOverlayMessage" });
  });
});
