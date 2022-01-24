import { render, screen } from "@testing-library/react";
import UserSection from "../../../components/layout/UserSection";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import userEvent from "@testing-library/user-event";
import { mockHistoryPush } from "../../../setupTests";

const mockStore = configureStore([]);

describe("UserSection Testing - case no user", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      overlayMessage: { message: "message" },
      token: { token: "token" },
      user: { user: null },
    });
    store.dispatch = jest.fn();
  });

  test("Have a check at UserUserSection Rendering", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserSection />
        </MemoryRouter>
      </Provider>
    );
    const text = screen.getByText("To Login");
    expect(text).toBeInTheDocument();
  });
});

describe("UserUserSection Testing - case User logged in", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      overlayMessage: { message: "message" },
      token: { token: "token" },
      user: { user: { username: "fake user name" } },
    });
    store.dispatch = jest.fn();
  });

  test("Have a check at UserSection Rendering", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserSection />
        </MemoryRouter>
      </Provider>
    );
    const text = screen.getByText("Hello fake user name");
    expect(text).toBeInTheDocument();
  });

  test("Have a check at User information redirecting", () => {
    let testLocation;
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserSection />
          <Route
            path='*'
            render={({ location }) => {
              testLocation = location;
              return null;
            }}
          ></Route>
        </MemoryRouter>
      </Provider>
    );
    userEvent.click(screen.getByText("User Information"));
    expect(testLocation.pathname).toEqual("/user/information");
  });

  test("Have a check at All accounts redirecting", () => {
    let testLocation;
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserSection />
          <Route
            path='*'
            render={({ location }) => {
              testLocation = location;
              return null;
            }}
          ></Route>
        </MemoryRouter>
      </Provider>
    );
    userEvent.click(screen.getByText("All Accounts"));
    expect(testLocation.pathname).toEqual("/user/list");
  });

  test("Have a check at LogOut redirecting", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <UserSection />
        </Provider>
      </MemoryRouter>
    );
    userEvent.click(screen.getByText("Logout"));
    expect(mockHistoryPush).toBeCalledWith("/user/login");
  });
});
