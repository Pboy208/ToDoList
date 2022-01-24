const Task = require("../../models/task");
const client = require("../../models/es-wrapper");
const sinon = require("sinon");
require("dotenv").config();

const bodyHits = [
  {
    _id: 2,
    _source: {
      name: "Finish ex5",
      status: "OPEN",
      priority: "HIGH",
    },
  },
  {
    _id: 1,
    _source: {
      name: "Finish ex4",
      status: "DONE",
      priority: "HIGH",
    },
  },
];

const resBody = {
  body: {
    hits: {
      hits: bodyHits,
    },
  },
  statusCode: 200,
};

const testingTask = {
  name: "Workout",
  status: "OPEN",
  priority: "MEDIUM",
};

const fakeSearch = jest.fn().mockResolvedValue(resBody);
const fakeIndex = jest.fn().mockResolvedValue({ statusCode: 200, body: { _id: 3 } });
const fakeUpdate = jest.fn().mockResolvedValue({ statusCode: 200 });
const fakeDelete = jest.fn().mockResolvedValue({ statusCode: 200 });
const fakeIdChecking = jest.fn().mockResolvedValue();

describe("Task model testing", () => {
  describe("Succesfully done", () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(client, "search").callsFake(fakeSearch);
      sandbox.stub(client, "index").callsFake(fakeIndex);
      sandbox.stub(client, "update").callsFake(fakeUpdate);
      sandbox.stub(client, "delete").callsFake(fakeDelete);
      sandbox.stub(client, "get").callsFake(fakeIdChecking);
    });

    afterEach(() => {
      sandbox.restore();
    });

    test("Get all task testing", async () => {
      const toDoList = await Task.getAll(1);
      expect(fakeSearch).toBeCalledWith({
        index: "todolist",
        body: {
          query: {
            match: {
              creatorId: 1,
            },
          },
        },
        size: 100,
      });
      expect(toDoList).toEqual([
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
      ]);
    });

    test("Add a task testing", async () => {
      const newTask = new Task(testingTask);
      const newId = await newTask.storeToList();
      expect(fakeIndex).toBeCalledWith({
        index: "todolist",
        type: "doc",
        body: {
          name: testingTask.name,
          status: testingTask.status,
          priority: testingTask.priority,
        },
      });
      expect(newId).toEqual(3);
    });

    test("Change a task testing", async () => {
      const newTask = new Task(testingTask);
      const resStatusCode = await newTask.updateToList();
      expect(fakeUpdate).toBeCalledWith({
        index: "todolist",
        type: "doc",
        id: testingTask.id,
        body: {
          doc: {
            name: testingTask.name,
            status: testingTask.status,
            priority: testingTask.priority,
          },
        },
      });
      expect(resStatusCode).toEqual(200);
    });

    test("Delete task testing", async () => {
      const resStatusCode = await Task.deleteFromList(testingTask.id);
      expect(fakeDelete).toBeCalledWith({
        index: "todolist",
        type: "doc",
        id: testingTask.id,
      });
      expect(resStatusCode).toEqual(200);
    });

    test("Is this Id exist", async () => {
      const isFound = await Task.isIdExisted(1);
      expect(fakeIdChecking).toBeCalledWith({
        index: "todolist",
        id: 1,
        type: "doc",
      });
      expect(isFound).toEqual(true);
    });

    test("Is this Name exist - case true", async () => {
      const testingTask = {
        name: "Finish ex4",
        status: "OPEN",
        priority: "MEDIUM",
      };
      const newTask = new Task(testingTask);
      const isFound = await newTask.isExistedName();
      expect(fakeIdChecking).toBeCalledWith({
        index: "todolist",
        id: 1,
        type: "doc",
      });
      expect(isFound).toEqual(true);
    });

    test("Is this Name exist - case false", async () => {
      const testingTask = {
        name: "Fisrt time exist",
        status: "OPEN",
        priority: "MEDIUM",
      };
      const newTask = new Task(testingTask);
      const isFound = await newTask.isExistedName();
      expect(fakeIdChecking).toBeCalledWith({
        index: "todolist",
        id: 1,
        type: "doc",
      });
      expect(isFound).toEqual(false);
    });

    test("Infinity scroll testing - case false", async () => {
      const toDoListByOffset = await Task.getByOffset(999, 999);
      expect(fakeSearch).toBeCalledWith({
        index: "todolist",
        body: {
          query: {
            match: {
              creatorId: 999,
            },
          },
        },
        from: 999 * process.env.TASKS_PER_OFFSET,
        size: process.env.TASKS_PER_OFFSET,
      });
      expect(toDoListByOffset).toEqual([
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
      ]);
    });
  });
  //---------------------------------------------------------------------------------------------------
  const fakeThrowError = jest.fn().mockRejectedValue(new Error({ statusCode: 404 }));
  const fakeClg = jest.fn();
  describe("Throw error", () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(client, "search").callsFake(fakeThrowError);
      sandbox.stub(client, "index").callsFake(fakeThrowError);
      sandbox.stub(client, "update").callsFake(fakeThrowError);
      sandbox.stub(client, "delete").callsFake(fakeThrowError);
      sandbox.stub(client, "get").callsFake(fakeThrowError);
      sandbox.stub(console, "log").callsFake(fakeClg);
    });

    afterEach(() => {
      sandbox.restore();
    });

    test("Get all task testing", async () => {
      try {
        await Task.getAll();
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("Add a task testing", async () => {
      try {
        const newTask = new Task(testingTask);
        await newTask.storeToList();
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("Change a task testing", async () => {
      try {
        const newTask = new Task(testingTask);
        await newTask.updateToList();
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("Delete task testing", async () => {
      try {
        await Task.deleteFromList(testingTask.id);
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("Is this Id exist", async () => {
      const isFound = await Task.isIdExisted(1);
      expect(isFound).toEqual(false);
    });

    test("Is this Name exist - case error", async () => {
      try {
        const newTask = new Task(testingTask);
        await newTask.isExistedName();
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("Get ToDoList By Offset testing", async () => {
      try {
        await Task.getByOffset(1, 1);
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });
  });
});
