const User = require("../../models/user");
const client = require("../../models/es-wrapper");
const sinon = require("sinon");
const HttpError = require("../../models/http-error");
const encryptByMd5 = require("md5");

const testingAccount = {
  id: 1,
  username: "testing",
  password: "testing",
  fullname: "testing",
  address: "testing",
  email: "testing",
};

const bodyHits = [
  {
    _id: 1,
    _source: {
      username: "testing",
      password: "ae2b1fca515949e5d54fb22b8ed95575",
      fullname: "testing",
      address: "testing",
      email: "testing",
    },
  },
];

const resBody = {
  body: {
    hits: {
      hits: bodyHits,
      total: 1,
    },
  },
  statusCode: 200,
};

const fakeIndex = jest.fn().mockResolvedValue({ statusCode: 200 });
const fakeUpdate = jest.fn().mockResolvedValue({ statusCode: 200 });
const fakeIdChecking = jest.fn().mockResolvedValue();
const fakeGet = jest.fn().mockResolvedValue({
  body: {
    _id: 1,
    _source: {
      id: 1,
      username: "testing",
      fullname: "testing",
      address: "testing",
      email: "testing",
    },
  },
});

describe("Task model testing", () => {
  describe("Succesfully done", () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    test("Login testing - return true", async () => {
      const fakeSearchForLogin = jest.fn().mockResolvedValue(resBody);
      sandbox.stub(client, "search").callsFake(fakeSearchForLogin);
      const user = new User({ username: "testing", password: "testing" });
      const valid = await user.login();
      expect(valid).toEqual(true);
      expect(user).toEqual(testingAccount);
    });

    test("Login testing - return false", async () => {
      const newResBody = {
        body: {
          hits: {
            hits: bodyHits,
            total: 0,
          },
        },
        statusCode: 200,
      };
      const fakeSearchForLogin = jest.fn().mockResolvedValue(newResBody);
      sandbox.stub(client, "search").callsFake(fakeSearchForLogin);
      const user = new User({ username: "testing", password: "testing" });
      const valid = await user.login();
      expect(valid).toEqual(false);
      expect(user).toEqual({ username: "testing", password: "testing" });
    });

    test("storeToDB testing", async () => {
      sandbox.stub(client, "index").callsFake(fakeIndex);
      const user = new User(testingAccount);
      const resStatusCode = await user.storeToDB();
      expect(resStatusCode).toEqual(200);
      expect(fakeIndex).toBeCalledWith({
        index: "account",
        type: "doc",
        body: {
          username: "testing",
          password: "ae2b1fca515949e5d54fb22b8ed95575",
          fullname: "testing",
          address: "testing",
          email: "testing",
        },
      });
    });

    test("updateAccountInformation testing", async () => {
      sandbox.stub(client, "update").callsFake(fakeUpdate);
      const user = new User(testingAccount);
      const resStatusCode = await user.updateAccountInformation();
      expect(resStatusCode).toEqual(200);
      expect(fakeIndex).toBeCalledWith({
        index: "account",
        type: "doc",
        body: {
          username: "testing",
          password: "ae2b1fca515949e5d54fb22b8ed95575",
          fullname: "testing",
          address: "testing",
          email: "testing",
        },
      });
    });

    test("getAll testing", async () => {
      const fakeSearch = jest.fn().mockResolvedValue(resBody);
      sandbox.stub(client, "search").callsFake(fakeSearch);
      const toDoList = await User.getAll();
      expect(fakeSearch).toBeCalledWith({
        index: "account",
        body: {
          query: {
            match_all: {},
          },
        },
        size: 100,
      });
      expect(toDoList).toEqual([{ id: 1, username: "testing", fullname: "testing", address: "testing", email: "testing" }]);
    });

    test("getAccountInfoById testing", async () => {
      sandbox.stub(client, "get").callsFake(fakeGet);
      const account = await User.getAccountInfoById(1);
      expect(fakeGet).toBeCalledWith({
        index: "account",
        id: 1,
        type: "doc",
      });
      expect(account).toEqual({
        id: 1,
        username: "testing",
        fullname: "testing",
        address: "testing",
        email: "testing",
      });
    });

    test("Is this Id exist - case true", async () => {
      sandbox.stub(client, "get").callsFake(fakeIdChecking);
      const isFound = await User.isIdExisted(1);
      expect(fakeIdChecking).toBeCalledWith({
        index: "account",
        id: 1,
        type: "doc",
      });
      expect(isFound).toEqual(true);
    });

    test("Is this Id exist - case false", async () => {
      sandbox.stub(client, "get").callsFake(jest.fn().mockRejectedValue(new Error()));
      const isFound = await User.isIdExisted(1);
      expect(isFound).toEqual(false);
    });

    test("Is this Name exist - case true", async () => {
      const fakeSearch = jest.fn().mockResolvedValue(resBody);
      sandbox.stub(client, "search").callsFake(fakeSearch);

      const user = new User({ username: "testing", id: 2 });
      const isFound = await user.isExistedUsername();
      expect(fakeSearch).toBeCalledWith({
        index: "account",
        body: {
          query: {
            match: {
              username: "testing",
            },
          },
        },
      });
      expect(isFound).toEqual(true);
    });

    test("Is this Name exist - case false", async () => {
      const fakeSearch = jest.fn().mockResolvedValue(resBody);
      sandbox.stub(client, "search").callsFake(fakeSearch);

      const user = new User({ username: "testing", id: 1 });
      const isFound = await user.isExistedUsername();
      expect(fakeSearch).toBeCalledWith({
        index: "account",
        body: {
          query: {
            match: {
              username: "testing",
            },
          },
        },
      });
      expect(isFound).toEqual(false);
    });
  });
  //---------------------------------------------------------------------------------------------------
  const fakeThrowError = jest.fn().mockRejectedValue(new Error());
  describe("Throw error", () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(client, "search").callsFake(fakeThrowError);
      sandbox.stub(client, "index").callsFake(fakeThrowError);
      sandbox.stub(client, "update").callsFake(fakeThrowError);
      sandbox.stub(client, "delete").callsFake(fakeThrowError);
      sandbox.stub(client, "get").callsFake(fakeThrowError);
    });

    afterEach(() => {
      sandbox.restore();
    });

    test("login testing", async () => {
      try {
        const user = new User({ username: "testing", password: "testing" });
        await user.login();
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("storeToDB testing", async () => {
      try {
        const user = new User(testingAccount);
        await user.storeToDB();
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("updateAccountInformation testing", async () => {
      try {
        const user = new User(testingAccount);
        await user.updateAccountInformation();
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("getAll testing", async () => {
      try {
        await User.getAll();
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("getAccountInfoById testing", async () => {
      try {
        await User.getAccountInfoById(1);
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    test("Is this Name exist - case error", async () => {
      try {
        const user = new User({ username: "testing", id: 1 });
        await user.isExistedUsername();
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });
  });
});
