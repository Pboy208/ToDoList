import { render, screen } from "@testing-library/react";
import MainNavigation from "../../../components/layout/MainNavigation";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import userEvent from "@testing-library/user-event";

const mockStore = configureStore([]);

describe("MainNavigation Testing", () => {
  let store;
  const mockSetState = jest.fn();

  jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: (initial) => [initial, mockSetState],
  }));

  beforeEach(() => {
    store = mockStore({
      overlayMessage: { message: "message" },
      token: { token: "token" },
      user: { user: "user" },
    });
    store.dispatch = jest.fn();
  });

  test("Have a check at translation after change language", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainNavigation />
        </MemoryRouter>
      </Provider>
    );

    const selectElement = screen.getByRole("combobox");
    userEvent.selectOptions(selectElement, "vi");
    // expect(mockSetState).toBeCalledWith();
  });
});
