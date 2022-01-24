import App from "../App";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { mockDispatch } from "../setupTests";
import configureStore from "redux-mock-store";
import { Suspense } from "react";

const mockFetchData = jest.fn();
jest.mock("../store/todolist-slice", () => ({
  ...jest.requireActual("../store/todolist-slice"),
  fetchData: () => mockFetchData,
}));

const mockCheckToken = jest.fn();
jest.mock("../store/token-slice", () => ({
  ...jest.requireActual("../store/token-slice"),
  checkForTokenInStorage: () => mockCheckToken,
}));

const mockStore = configureStore([]);
global.alert = jest.fn();

describe("App testing", () => {
  let store;

  test("useEffect testing - case isNotInStorage, isExpired", async () => {
    store = mockStore({
      overlayMessage: { message: null },
      user: { user: null },
      toDoList: { list: [] },
      token: { token: "fakeToken", isExpired: true, isNotInStorage: true },
    });
    store.dispatch = jest.fn();
    render(
      <Suspense fallback={<div className='loading'>Loading...</div>}>
        <Provider store={store}>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </Provider>
      </Suspense>
    );

    const text = screen.getByText("Login Required");

    expect(text).toBeInTheDocument();
    expect(global.alert).toBeCalledWith("Your token has expired, please login again");
    expect(global.alert).toBeCalledWith("You need to login first");
    expect(mockDispatch).toBeCalledWith(mockCheckToken);
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: "user/clearUser" });
  });

  test("useEffect testing - case !isNotInStorage, !isExpired,!token", () => {
    store = mockStore({
      overlayMessage: { message: null },
      user: { user: null },
      toDoList: { list: [] },
      token: { token: null, isExpired: false, isNotInStorage: false },
    });
    store.dispatch = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(global.alert).not.toBeCalledWith("Your token has expired, please login again");
    expect(global.alert).not.toBeCalledWith("You need to login first");
    expect(mockDispatch).not.toBeCalledWith(mockFetchData);
  });

  test("user exist,render Login component testing", () => {
    store = mockStore({
      overlayMessage: { message: null },
      toDoList: { list: [] },
      token: { token: "fakeToken", isExpired: true, isNotInStorage: true },
      user: { user: { username: "fakeUsername" } },
    });
    store.dispatch = jest.fn();
    render(
      <Suspense fallback={<div className='loading'>Loading...</div>}>
        <Provider store={store}>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </Provider>
      </Suspense>
    );
    const text = screen.getByText("Hello fakeUsername");
    expect(text).toBeInTheDocument();
  });

  test("Message exist,render UserInputAlert component testing", () => {
    store = mockStore({
      overlayMessage: { message: "You are trying to modify a task with invalid input" },
      toDoList: { list: [] },
      token: { token: "fakeToken", isExpired: true, isNotInStorage: true },
      user: { user: null },
    });
    store.dispatch = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );
    const text = screen.getByText("You are trying to modify a task with invalid input");
    expect(text).toBeInTheDocument();
  });
});
