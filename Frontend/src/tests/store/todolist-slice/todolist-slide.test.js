import { fetchData } from "../../../store/todolist-slice";
import todolistSlice, { todolistActions } from "../../../store/todolist-slice";

const endPoint = "http://localhost:3000/todolist";

const defaultList = [
  {
    id: 2,
    name: "Finish ex5",
    status: "OPEN",
    priority: "HIGH",
  },
  {
    id: 1,
    name: "Finish ex4",
    status: "DONE",
    priority: "HIGH",
  },
];

const defaultState = {
  list: defaultList,
  hasMore: false,
  nextOffset: 0,
  offset: 0,
};

const fakeDispatch = jest.fn();

global.fetch = (api, options = { method: "POST" }) => {
  switch (api) {
    case endPoint:
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(defaultList),
      });
    case endPoint + "/add":
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 3 }),
      });
    case endPoint + "/2":
      if (options.method === "PUT") {
        return Promise.resolve({
          ok: true,
        });
      } else if (options.method === "DELETE") {
        return Promise.resolve({
          ok: true,
        });
      }
      break;
    default:
      return null;
  }
};

describe("Thunks Testing", () => {
  test("fetchData Testing", async () => {
    await fetchData()(fakeDispatch);
    expect(fakeDispatch).toBeCalledWith({
      payload: defaultList,
      type: "todolist/listInitialize",
    });
  });
});

describe("todolist-slice actions Testing", () => {
  test("listInitialize Testing", () => {
    expect(todolistSlice.reducer(defaultState, todolistActions.listInitialize(defaultList))).toEqual({
      nextOffset: 0,
      list: defaultList,
      hasMore: false,
      offset: 0,
    });
  });

  test("addToList Testing", () => {
    const testingTask = {
      id: 3,
      name: "Finish ex6",
      status: "DONE",
      priority: "HIGH",
    };

    expect(todolistSlice.reducer(defaultState, todolistActions.addToList(testingTask))).toEqual({
      ...defaultState,
      list: [testingTask, ...defaultList],
    });
  });

  test("changeInList Testing", () => {
    const testingTask = {
      id: 2,
      name: "Finish ex5.55",
      status: "DONE",
      priority: "HIGH",
    };

    const expectedList = defaultList.map((task) => {
      return task.id === testingTask.id ? testingTask : task;
    });

    expect(todolistSlice.reducer(defaultState, todolistActions.changeInList(testingTask))).toEqual({
      ...defaultState,
      list: [...expectedList],
    });
  });

  test("removeFromList Testing", () => {
    const removedTaskId = 2;

    const expectedList = defaultList.filter((task) => {
      return task.id !== removedTaskId;
    });

    expect(todolistSlice.reducer(defaultState, todolistActions.removeFromList(removedTaskId))).toEqual({
      ...defaultState,
      list: [...expectedList],
    });
  });

  test("setHasMore Testing", () => {
    expect(todolistSlice.reducer(defaultState, todolistActions.setHasMore(false))).toEqual({
      ...defaultState,
      hasMore: false,
    });
  });

  test("appendList Testing", () => {
    const newTasks = [
      {
        id: 3,
        name: "Finish ex5",
        status: "DONE",
        priority: "HIGH",
      },
      {
        id: 4,
        name: "Finish ex6",
        status: "DONE",
        priority: "HIGH",
      },
    ];
    const expectedList = [...defaultList, ...newTasks];

    expect(todolistSlice.reducer(defaultState, todolistActions.appendList(newTasks))).toEqual({
      ...defaultState,
      list: [...expectedList],
      nextOffset: 1,
    });
  });

  test("setOffset Testing", () => {
    expect(todolistSlice.reducer(defaultState, todolistActions.setOffset(1))).toEqual({
      ...defaultState,
      offset: 1,
    });
  });
});
