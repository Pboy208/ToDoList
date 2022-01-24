import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import TaskItem from "../../../components/tasks/TaskItem";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { mockDispatch } from "../../../setupTests";
import { mockHistoryPush } from "../../../setupTests";

jest.useFakeTimers();

jest.mock("../../../hooks/http-hook", () => ({
  useHttpClient: () => async () => Promise.resolve("resData"),
}));

const mockStore = configureStore([]);

describe("TaskItem Testing", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      overlayMessage: { message: "message" },
      token: { token: "token" },
    });
    store.dispatch = jest.fn();
  });

  test("Have a check at redirect after edit button clicked", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <TaskItem id={1} name='Testing' priority='HIGH' status='OPEN' />
        </Provider>
      </MemoryRouter>
    );

    const editBtnElement = screen.getByTestId("edit-btn-1");
    userEvent.click(editBtnElement);
    expect(mockHistoryPush).toBeCalledWith("/todolist/edit/1");
  });

  test("Have a check at DeletePrompt showing after delete button clicked", () => {
    render(
      <Provider store={store}>
        <TaskItem id={1} name='Testing' priority='HIGH' status='OPEN' />
      </Provider>
    );

    const deleteBtnElement = screen.getByTestId("delete-btn-1");
    userEvent.click(deleteBtnElement);

    const deletePromptMessage = screen.getByText("Do you want to delete this item");
    expect(deletePromptMessage).toBeInTheDocument();
  });

  test("Have a check after confirm delete button clicked", async () => {
    const deleteTaskHandler = jest.fn();
    render(
      <Provider store={store}>
        <TaskItem
          id={1}
          name='Testing'
          priority='HIGH'
          status='OPEN'
          deleteTaskHandler={deleteTaskHandler}
        />
      </Provider>
    );

    const deleteBtnElement = screen.getByTestId("delete-btn-1");
    userEvent.click(deleteBtnElement);

    const confirmBtnElement = screen.getByText("DELETE");
    userEvent.click(confirmBtnElement);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(mockDispatch).toBeCalled();
  });

  test("Have a check after cancel delete button clicked", () => {
    const deleteTaskHandler = jest.fn();

    render(
      <Provider store={store}>
        <TaskItem
          id={1}
          name='Testing'
          priority='HIGH'
          status='OPEN'
          deleteTaskHandler={deleteTaskHandler}
        />
      </Provider>
    );

    const deleteBtnElement = screen.getByTestId("delete-btn-1");
    userEvent.click(deleteBtnElement);

    const cancelBtnElement = screen.getByText("CANCEL", { exact: false });
    userEvent.click(cancelBtnElement);

    expect(deleteBtnElement).toBeInTheDocument();
  });
});
