import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ToDoList from "../../pages/task/ToDoList";
import { mockDispatch } from "../../setupTests";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const mockSendRequest = jest.fn();
jest.mock("../../hooks/http-hook", () => ({
  useHttpClient: () => mockSendRequest,
}));

const fakeToDoList = [
  { id: 1, name: "example1", status: "IN PROGRESS", priority: "HIGH" },
  { id: 2, name: "example2", status: "IN PROGRESS", priority: "HIGH" },
  { id: 3, name: "example3", status: "IN PROGRESS", priority: "HIGH" },
  { id: 4, name: "example4", status: "IN PROGRESS", priority: "HIGH" },
  { id: 5, name: "example5", status: "IN PROGRESS", priority: "HIGH" },
  { id: 6, name: "example6", status: "IN PROGRESS", priority: "HIGH" },
  { id: 7, name: "example7", status: "IN PROGRESS", priority: "HIGH" },
  { id: 8, name: "example8", status: "IN PROGRESS", priority: "HIGH" },
  { id: 9, name: "example9", status: "IN PROGRESS", priority: "HIGH" },
  { id: 10, name: "example10", status: "IN PROGRESS", priority: "HIGH" },
  { id: 11, name: "example11", status: "IN PROGRESS", priority: "HIGH" },

  {
    id: 12,
    name: "Testing",
    status: "IN PROGRESS",
    priority: "HIGH",
  },
];

const mockObserve = jest.fn();

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {
    return null;
  }

  observe(lastTaskElement) {
    return mockObserve(lastTaskElement);
  }
};

describe("ToDoList Testing", () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      toDoList: { list: fakeToDoList, hasMore: true, offset: 0, nextOffset: 0 },
    });
    store.dispatch = jest.fn();
  });
  test("Have a check at redirect when no task in toDoList", () => {
    store = mockStore({
      toDoList: { list: [], hasMore: true, offset: 0, nextOffset: 0 },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToDoList />
        </MemoryRouter>
      </Provider>
    );
    const alertMessage = screen.getByText("Oh no,it seems like you don't have any task", {
      exact: false,
    });

    expect(alertMessage).toBeInTheDocument();
  });

  test("Have a check at rendering toDoList", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToDoList />
        </MemoryRouter>
      </Provider>
    );
    const nameInputElement = screen.getByText("Testing");
    const lastTaskElement = screen.getByText("Testing").parentNode.parentNode;
    expect(nameInputElement).toBeInTheDocument();
    expect(mockObserve).toBeCalledWith(lastTaskElement);
  });

  test("fetch by offset - case resData.lenth >0", async () => {
    mockSendRequest.mockImplementation(async () => Promise.resolve(["resData"]));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToDoList />
        </MemoryRouter>
      </Provider>
    );
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(mockDispatch).toBeCalledWith({ payload: ["resData"], type: "todolist/appendList" });
  });

  test("fetch by offset - case resData.lenth === 0", async () => {
    mockSendRequest.mockImplementation(async () => Promise.resolve([]));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToDoList />
        </MemoryRouter>
      </Provider>
    );
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(mockDispatch).toBeCalledWith({ payload: false, type: "todolist/setHasMore" });
  });

  test("IntersectionObserver triggered, offset Increase", async () => {
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        callback([{ isIntersecting: true }]);
      }

      disconnect() {
        return null;
      }

      observe(lastTaskElement) {
        return mockObserve(lastTaskElement);
      }
    };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToDoList />
        </MemoryRouter>
      </Provider>
    );
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: "todolist/setOffset" });
  });

  test("Scroll testing, offset Increase", async () => {
    jest.useFakeTimers();
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        setTimeout(() => {
          const scrollElement = document.getElementsByClassName("list")[0];
          if (scrollElement.scrollTop === 630) {
            callback([{ isIntersecting: true }]);
          }
        }, 50000);
      }

      disconnect() {
        return null;
      }

      observe(lastTaskElement) {
        return mockObserve(lastTaskElement);
      }
    };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ToDoList />
        </MemoryRouter>
      </Provider>
    );

    const listElement = container.getElementsByClassName("list")[0];
    listElement.scrollTop = 630;
    jest.runAllTimers();
    expect(mockDispatch).toBeCalledWith({ payload: undefined, type: "todolist/setOffset" });
  });
});
