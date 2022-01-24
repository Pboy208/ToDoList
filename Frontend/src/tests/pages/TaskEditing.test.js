import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TaskEditing from "../../pages/task/TaskEditing";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe("TaskEditing test", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      overlayMessage: { message: "message" },
      toDoList: {
        list: [
          {
            id: 1,
            name: "Testing",
            priority: "HIGH",
            status: "IN PROGRESS",
          },
        ],
      },
    });
    store.dispatch = jest.fn();
  });

  test("Have a check at rendering", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TaskEditing />
        </MemoryRouter>
      </Provider>
    );

    const nameInputElement = screen.getByRole("textbox");

    expect(nameInputElement.value).toEqual("Testing");
  });

  test("Have a check at redirect when no task id match", () => {
    store = mockStore({
      overlayMessage: { message: "message" },
      toDoList: {
        list: [],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TaskEditing />
        </MemoryRouter>
      </Provider>
    );

    const alertMessage = screen.getByText("No task id match!", { exact: false });

    expect(alertMessage).toBeInTheDocument();
  });
});
