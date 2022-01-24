import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TaskForm from "../../../components/tasks/TaskForm";
import { expect } from "@jest/globals";
import { mockDispatch } from "../../../setupTests";
import {mockHistoryPush} from "../../../setupTests";

jest.mock("../../../store/todolist-slice", () => ({
  ...jest.requireActual("../../../store/todolist-slice"),
  putData: (a, b, callback) => {
    return callback();
  },
  postData: (a, b, callback) => {
    return callback();
  },
}));

jest.mock("../../../hooks/http-hook", () => ({
  useHttpClient: () => () => "resData",
}));

const mockStore = configureStore([]);

describe("TaskForm Testing", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      overlayMessage: { message: "message" },
      token: { token: "token" },
    });
    store.dispatch = jest.fn();
  });

  test("Have a check at input fields clearance after cancel button clicked", () => {
    const chosenTask = {
      id: 100,
      name: "TaskForm Checking",
      priority: "HIGH",
      status: "IN PROGRESS",
    };
    render(
      <Provider store={store}>
        <TaskForm chosenTask={chosenTask} />
      </Provider>
    );

    const cancelBtnElement = screen.getByText("CANCEL", { exact: false });
    userEvent.click(cancelBtnElement);

    const inputElement = screen.getByRole("textbox");
    const selectElements = screen.getAllByRole("combobox");

    expect(inputElement.value).toEqual("");
    for (let select of selectElements) {
      expect(select.value).toEqual("");
    }
  });

  test("Have a check at submitFormHandler func after save button clicked - case isEditForm:true", async () => {
    const chosenTask = {
      id: 1,
      name: "TaskForm Checking",
      priority: "HIGH",
      status: "IN PROGRESS",
    };

    render(
      <Provider store={store}>
        <TaskForm chosenTask={chosenTask} isEditForm={true} />
      </Provider>
    );

    const saveBtnElement = screen.getByText("SAVE", { exact: false });
    userEvent.click(saveBtnElement);

    await Promise.resolve();
    expect(mockDispatch).toBeCalled();
    expect(mockHistoryPush).toBeCalledWith("/");
  });

  test("Have a check at submitFormHandler func after save button clicked - case isEditForm:false", async () => {
    const chosenTask = {
      id: 100,
      name: "TaskForm Checking",
      priority: "HIGH",
      status: "IN PROGRESS",
    };

    render(
      <Provider store={store}>
        <TaskForm chosenTask={chosenTask} isEditForm={false} />
      </Provider>
    );

    const saveBtnElement = screen.getByText("SAVE", { exact: false });
    userEvent.click(saveBtnElement);
    await Promise.resolve();
    expect(mockDispatch).toBeCalled();
    expect(mockHistoryPush).toBeCalledWith("/");
  });

  test("Have a check after save button clicked - case save-btn disabled", () => {
    const newTask = {
      id: 100,
      name: "",
      priority: "HIGH",
      status: "IN PROGRESS",
    };

    render(
      <Provider store={store}>
        <TaskForm chosenTask={newTask} isEditForm={false} />
      </Provider>
    );

    const saveBtnElement = screen.getByText("SAVE", { exact: false }).parentNode;
    expect(saveBtnElement.disabled).toEqual(true);
  });

  test("Have a check at invalid message", () => {
    const chosenTask = {
      id: 100,
      name: "The illustrious francine j. harris is in the proverbial building, and we couldn’t be more thrilled. The award-winning poet breaks down the transformative potential of being a hater, mourning the loss of anonymity at the open mic, championing the poets she’s in lineage of, and much much more.",
      priority: "HIGH",
      status: "IN PROGRESS",
    };
    render(
      <Provider store={store}>
        <TaskForm chosenTask={chosenTask} />
      </Provider>
    );

    const saveBtnElement = screen.getByText("SAVE", { exact: false });
    userEvent.click(saveBtnElement);

    const invalidMessage = screen.getByText("Name should be less than 255 characters");

    expect(invalidMessage).toBeInTheDocument();
  });

  test("Have a check at invalid message clearance after input field changed", () => {
    const chosenTask = {
      id: 100,
      name: "The illustrious francine j. harris is in the proverbial building, and we couldn’t be more thrilled. The award-winning poet breaks down the transformative potential of being a hater, mourning the loss of anonymity at the open mic, championing the poets she’s in lineage of, and much much more.",
      priority: "HIGH",
      status: "IN PROGRESS",
    };
    const { container } = render(
      <Provider store={store}>
        <TaskForm chosenTask={chosenTask} />
      </Provider>
    );

    const saveBtnElement = screen.getByText("SAVE", { exact: false });
    userEvent.click(saveBtnElement);

    const name = container.querySelector("#name");
    userEvent.clear(name);

    expect(container.querySelector(".invalid-message").textContent).toMatch("");
  });
});
