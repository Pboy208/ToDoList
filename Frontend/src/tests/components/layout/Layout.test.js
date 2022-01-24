import { render, screen } from "@testing-library/react";
import Layout from "../../../components/layout/Layout";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe("Layout Testing", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      overlayMessage: { message: "message" },
      token: { token: "token" },
      user: { user: "user" },
    });
    store.dispatch = jest.fn();
  });

  test("Have a check at Layout.js rendering", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Layout>
            <div>This is testing sentence</div>
          </Layout>
        </MemoryRouter>
      </Provider>
    );

    const testingSentence = screen.getByText("This is testing sentence");
    expect(testingSentence).toBeInTheDocument();
  });
});
