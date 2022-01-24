import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TaskAdding from "../../pages/task/TaskAdding";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe("TaskAdding Testing", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      overlayMessage: { message: "message" },
    });
    store.dispatch = jest.fn();
  });

  test("Have a check at rendering", () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <TaskAdding />
        </MemoryRouter>
      </Provider>
    );

    const name = container.querySelector("#name");
    const inputElement = screen.getByRole("textbox");
    const selectElements = screen.getAllByRole("combobox");

    expect(name).toBeInTheDocument();
    expect(inputElement.value).toEqual("");
    for (let select of selectElements) {
      expect(select.value).toEqual("");
    }
  });
});
