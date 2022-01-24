const {
  getToDoList,
  addTaskToList,
  changeTaskInList,
  deleteTaskFromList,
  getListByOffset,
} = require("../../controllers/toDoList");
const sinon = require("sinon");
const client = require("../../models/es-wrapper");
const { error } = require("ajv/dist/vocabularies/applicator/dependencies");
const Task = require("../../models/task");

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

const fakeSearch = jest.fn().mockResolvedValue(resBody);
const fakeIndex = jest.fn().mockResolvedValue({ statusCode: 200, body: { _id: 3 } });
const fakeUpdate = jest.fn().mockResolvedValue({ statusCode: 200 });
const fakeDelete = jest.fn().mockResolvedValue({ statusCode: 200 });

const fakeIdChecking = jest.fn((reqBody) => {
  if (reqBody.id == -1) throw error();
  return Promise.resolve(true);
});

const fakeThrowError = jest.fn((reqBody) => {
  if (reqBody.body.query.match.name) {
    return Promise.resolve(resBody);
  }
  throw Error();
});

const mockRequest = () => {
  const req = {};
  req.body = {
    name: "Workout",
    status: "OPEN",
    priority: "LOW",
  };
  req.userData = { userId: 1 };
  req.params = { taskId: 3, offset: 1 };
  return req;
};

const mockRespone = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("ToDoListController Testing", () => {
  describe("Succesfully done", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(client, "search").callsFake(fakeSearch);
      sandbox.stub(client, "index").callsFake(fakeIndex);
      sandbox.stub(client, "update").callsFake(fakeUpdate);
      sandbox.stub(client, "delete").callsFake(fakeDelete);
      sandbox.stub(client, "get").callsFake(fakeIdChecking);
      sandbox.stub(Task, "getByOffset").callsFake(async () => Promise.resolve("FakeToDoList"));
      req = mockRequest();
      res = mockRespone();
      next = jest.fn();
    });

    afterEach(() => {
      sandbox.restore();
    });

    // User story 1 testing
    test("Get the ToDoList", async () => {
      await getToDoList(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(defaultList);
    });

    // User story 2 testing
    test("Add task to the list - case succesfully done", async () => {
      await addTaskToList(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({ id: 3 });
    });

    // User story 3 testing
    test("Change task to the list - case succesfully done", async () => {
      req.body.name = "Changed name";
      req.params = { taskId: 2 };
      await changeTaskInList(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({});
    });

    // User story 4 testing
    test("Delete task from the list - case succesfully done", async () => {
      req.params = { taskId: 2 };
      await deleteTaskFromList(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({});
    });

    // Infinity scroll testing
    test("Infinity scroll testing - case succesfully done", async () => {
      await getListByOffset(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith("FakeToDoList");
    });
  });
  //----------------------------------------------------------------------------------
  describe("Error with input", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(client, "search").callsFake(fakeSearch);
      sandbox.stub(client, "index").callsFake(fakeIndex);
      sandbox.stub(client, "update").callsFake(fakeUpdate);
      sandbox.stub(client, "delete").callsFake(fakeDelete);
      sandbox.stub(client, "get").callsFake(fakeIdChecking);
      req = mockRequest();
      res = mockRespone();
      next = jest.fn();
    });

    afterEach(() => {
      sandbox.restore();
    });

    // User story 2 testing
    test("Add task to the list - case invalid schema", async () => {
      req.body.status = "NOT OK";
      await addTaskToList(req, res, next);
      expect(next).toBeCalledWith(new Error("TASK_INVALID_INPUT"));
    });

    test("Add task to the list - case duplicate name", async () => {
      req.body.name = "Finish ex4";
      await addTaskToList(req, res, next);
      expect(next).toBeCalledWith(new Error("TASK_EXISTED_NAME"));
    });

    // User story 3 testing
    test("Change task to the list - case not found", async () => {
      req.params.taskId = -1;
      await changeTaskInList(req, res, next);
      expect(next).toBeCalledWith(new Error("TASK_NOT_EXISTS"));
    });

    test("Change task to the list - case invalid schema", async () => {
      req.body.status = "NOT OK";
      req.params = { taskId: 2 };
      await changeTaskInList(req, res, next);
      expect(next).toBeCalledWith(new Error("TASK_INVALID_INPUT"));
    });

    test("Change task to the list - case duplicate name", async () => {
      req.body.name = "Finish ex4";
      req.params = { taskId: 2 };
      await changeTaskInList(req, res, next);
      expect(next).toBeCalledWith(new Error("TASK_EXISTED_NAME"));
    });

    // User story 4 testing
    test("Delete task from the list - case not found", async () => {
      req.params.taskId = -1;
      await deleteTaskFromList(req, res, next);
      expect(next).toBeCalledWith(new Error("TASK_NOT_EXISTS"));
    });
  });

  //---------------------------------------------------------------------------------------------------
  describe("Throw error", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
      req = mockRequest();
      res = mockRespone();
      next = jest.fn();
      sandbox = sinon.createSandbox();
      sandbox.stub(client, "search").callsFake(fakeThrowError);
      sandbox.stub(client, "index").callsFake(fakeThrowError);
      sandbox.stub(client, "update").callsFake(fakeThrowError);
      sandbox.stub(client, "delete").callsFake(fakeThrowError);
      sandbox.stub(client, "get").callsFake(fakeIdChecking);
      sandbox
        .stub(Task, "getByOffset")
        .callsFake(async () => Promise.reject(new Error("SERVER_INTERNAL_ERROR")));
    });

    afterEach(() => {
      sandbox.restore();
    });

    test("Get all task testing", async () => {
      await getToDoList(req, res, next);
      expect(next).toBeCalledWith(new Error("SERVER_INTERNAL_ERROR"));
    });

    test("Add a task testing", async () => {
      await addTaskToList(req, res, next);
      expect(next).toBeCalledWith(new Error("SERVER_INTERNAL_ERROR"));
    });

    test("Change a task testing", async () => {
      req.body.name = "Changed name";
      req.params = { taskId: 2 };
      await changeTaskInList(req, res, next);
      expect(next).toBeCalledWith(new Error("SERVER_INTERNAL_ERROR"));
    });

    test("Delete task testing", async () => {
      req.params = { taskId: 1 };
      await deleteTaskFromList(req, res, next);
      expect(next).toBeCalledWith(new Error("SERVER_INTERNAL_ERROR"));
    });

    test("Infinity scroll testing", async () => {
      await getListByOffset(req, res, next);
      expect(next).toBeCalledWith(new Error("SERVER_INTERNAL_ERROR"));
    });
  });
});
