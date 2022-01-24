import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeletePrompt from "../../../components/prompts/DeletePrompt";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe("DeletePrompt Testing", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      overlayMessage: { message: "message" },
      token: { token: "token" },
    });
    store.dispatch = jest.fn();
  });

  test("Have a check after delete button clicked", () => {
    const choiceHandler = jest.fn();

    render(
      <Provider store={store}>
        <DeletePrompt choiceHandler={choiceHandler} />
      </Provider>
    );

    const confirmBtnElement = screen.getByText("DELETE");
    userEvent.click(confirmBtnElement);

    expect(choiceHandler).toBeCalledWith(true);
  });

  test("Have a check after cancel button clicked", () => {
    const choiceHandler = jest.fn();

    render(
      <Provider store={store}>
        <DeletePrompt choiceHandler={choiceHandler} />
      </Provider>
    );

    const cancelBtnElement = screen.getByText("CANCEL", { exact: false });
    userEvent.click(cancelBtnElement);

    expect(choiceHandler).toBeCalledWith(false);
  });
});
