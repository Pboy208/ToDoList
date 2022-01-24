const {
  login,
  tokenReview,
  addAccount,
  changeAccoutnInfomation,
  getAllAccounts,
  getAccountInfoById,
  signUp,
} = require("../../controllers/auths");
const sinon = require("sinon");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const messageBroker = require("../../message_broker/rabbitmq");

const mockReqBody = {
  username: "testingabc",
  password: "testingab",
  email: "testing@gmail.com",
  address: "testing",
  fullname: "testing",
};

jest.mock("../../models/user");

const mockRequest = () => {
  const req = {};
  req.body = {};
  req.params = { userId: 1 };
  req.headers = { authorization: "Bearer fakeToken" };
  req.userData = { userId: 1 };
  return req;
};

const mockRespone = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("AuthsController Testing", () => {
  describe("Succesfully done", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(jwt, "verify").callsFake(() => true);
      sandbox.stub(jwt, "sign").callsFake(() => "fakeToken");
      sandbox.stub(jwt, "decode").callsFake(() => ({
        userId: "fake",
        fullname: "fake",
        username: "fake",
        address: "fake",
        email: "fake",
      }));
      req = mockRequest();
      res = mockRespone();
      next = jest.fn();
      User.mockImplementation(() => {
        return {
          id: 1,
          username: "testing",
          password: "testing",
          fullname: "testing",
          address: "testing",
          email: "testing",
          login: async () => Promise.resolve(true),
          isExistedUsername: async () => Promise.resolve(false),
          storeToDB: async () => Promise.resolve(true),
          isIdExisted: async () => Promise.resolve(false),
          updateAccountInformation: async () => Promise.resolve(true),
        };
      });
      sandbox.stub(User, "isIdExisted").callsFake(async () => Promise.resolve(true));
      sandbox.stub(User, "getAll").callsFake(async () => Promise.resolve([]));
      sandbox.stub(User, "getAccountInfoById").callsFake(async () => Promise.resolve("fakeUser"));
      sandbox.stub(messageBroker, "send").callsFake(async () => Promise.resolve(true));
    });

    afterEach(() => {
      sandbox.restore();
    });

    // User story 1 testing
    test("login testing", async () => {
      req.body = { username: "testingabc", password: "testingabc" };
      await login(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({
        token: "fakeToken",
      });
    });

    // User story 2 testing
    test("tokenReview testing", async () => {
      await tokenReview(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({ token: "fakeToken" });
    });

    // User story 3 testing
    test("addAccount testing", async () => {
      req.body = mockReqBody;
      await addAccount(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({ message: "Successfully" });
    });

    // User story 4 testing
    test("changeAccoutnInfomation testing", async () => {
      req.body = mockReqBody;
      await changeAccoutnInfomation(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({ message: "Successfully" });
    });

    // User story 5 testing
    test("getAllAccounts testing", async () => {
      await getAllAccounts(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({ data: [] });
    });

    // User story 6 testing
    test("getAccountInfoById testing", async () => {
      await getAccountInfoById(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({ data: "fakeUser" });
    });

    // User story 7 testing
    test("signUp testing", async () => {
      req.body = {
        username: "testingName",
        password: "testingPW",
        passwordConfirm: "testingPW",
        fullname: "testing",
        address: "testing",
        email: "testing@gmail.com",
      };
      await signUp(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({ message: "successfully" });
    });
  });
  //----------------------------------------------------------------------------------
  describe("Error with input", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(jwt, "sign").callsFake(() => "fakeToken");
      sandbox.stub(jwt, "verify").callsFake(() => true);
      req = mockRequest();
      res = mockRespone();
      next = jest.fn();
      User.mockImplementation(() => {
        return {
          id: 1,
          username: "testing",
          password: "testing",
          fullname: "testing",
          address: "testing",
          email: "testing",
          login: async () => Promise.resolve(false),
          isExistedUsername: async () => Promise.resolve(true),
          storeToDB: async () => Promise.resolve(true),
          isIdExisted: async () => Promise.resolve(false),
          updateAccountInformation: async () => Promise.resolve(true),
        };
      });
      sandbox.stub(User, "getAll").callsFake(async () => Promise.resolve([]));
      sandbox.stub(User, "getAccountInfoById").callsFake(async () => Promise.resolve("fakeUser"));
    });

    afterEach(() => {
      sandbox.restore();
    });

    // User story 1 testing
    test("login - case invalid schema", async () => {
      await login(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_INVALID_INPUT"));
    });

    test("login - case wrong username/password", async () => {
      req.body = {
        username: "testingabc",
        password: "testingab",
      };
      await login(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_INVALID_LOGININFO"));
    });

    // User story 3 testing
    test("addAccount - case invalid schema", async () => {
      await addAccount(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_INVALID_INPUT"));
    });

    test("addAccount - case existed username", async () => {
      req.body = mockReqBody;
      await addAccount(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_EXISTED_USERNAME"));
    });

    // User story 4 testing
    test("changeAccoutnInfomation - case invalid schema", async () => {
      await changeAccoutnInfomation(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_INVALID_INPUT"));
    });

    test("changeAccoutnInfomation - case id not found", async () => {
      sandbox.stub(User, "isIdExisted").callsFake(async () => Promise.resolve(false));
      req.body = mockReqBody;
      await changeAccoutnInfomation(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_NOTFOUND"));
    });

    test("changeAccoutnInfomation - case invalid token acces", async () => {
      sandbox.stub(User, "isIdExisted").callsFake(async () => Promise.resolve(true));
      req.body = mockReqBody;
      req.userData.userId = -1;
      await changeAccoutnInfomation(req, res, next);
      expect(next).toBeCalledWith(new Error("TOKEN_ACCESS_DENIED"));
    });

    // User story 6 testing
    test("getAccountInfoById - case id not found", async () => {
      await getAccountInfoById(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_NOTFOUND"));
    });

    // User story 7 testing
    test("signUp - case passwords not match", async () => {
      req.body = {
        username: "testingName",
        password: "testingPW",
        passwordConfirm: "faketesting",
        fullname: "testing",
        address: "testing",
        email: "testing@gmail.com",
      };
      await signUp(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_INVALID_INPUT"));
    });

    test("signUp - case invalid input", async () => {
      req.body = {
        username: "a",
        password: "a",
        passwordConfirm: "a",
        fullname: "a",
        address: "a",
        email: "a",
      };
      await signUp(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_INVALID_INPUT"));
    });

    test("signUp - case existed username", async () => {
      req.body = {
        username: "testingName",
        password: "testingPW",
        passwordConfirm: "testingPW",
        fullname: "testing",
        address: "testing",
        email: "testing@gmail.com",
      };
      await signUp(req, res, next);
      expect(next).toBeCalledWith(new Error("USER_EXISTED_USERNAME"));
    });
  });

  //---------------------------------------------------------------------------------------------------
  describe("Throw error", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(jwt, "sign").callsFake(() => new Error("error"));
      sandbox.stub(jwt, "verify").callsFake(() => new Error("error"));
      req = mockRequest();
      res = mockRespone();
      next = jest.fn();
      User.mockImplementation(() => {
        return {
          id: 1,
          username: "testing",
          password: "testing",
          fullname: "testing",
          address: "testing",
          email: "testing",
          login: async () => Promise.reject(new Error()),
          isExistedUsername: async () => Promise.resolve(false),
          storeToDB: async () => Promise.reject(new Error()),
          isIdExisted: async () => Promise.resolve(false),
          updateAccountInformation: async () => Promise.reject(new Error()),
        };
      });
      sandbox.stub(User, "isIdExisted").callsFake(async () => Promise.resolve(true));
      sandbox.stub(User, "getAll").callsFake(async () => Promise.reject(new Error()));
      sandbox.stub(User, "getAccountInfoById").callsFake(async () => Promise.reject(new Error()));
      sandbox.stub(messageBroker, "send").callsFake(async () => Promise.rejest(new Error()));
    });

    afterEach(() => {
      sandbox.restore();
    });

    // User story 1 testing
    test("login testing - case login fail", async () => {
      try {
        req.body = { username: "testingabc", password: "testingabc" };
        await login(req, res, next);
      } catch (error) {
        expect(error.errorCode).toEqual(401);
        expect(error.message).toEqual("USER_INVALID_LOGININFO");
      }
    });

    test("login testing - case elasticSearch error", async () => {
      try {
        req.body = { username: "testingabc", password: "testingabc" };
        await login(req, res, next);
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    // User story 2 testing
    test("tokenReview testing - case token not found", async () => {
      try {
        req.headers.authorization = "Bear ";
        await tokenReview(req, res, next);
      } catch (error) {
        console.log(error);
        expect(error.errorCode).toEqual(401);
        expect(error.message).toEqual("TOKEN_INVALID");
      }
    });

    test("tokenReview testing - case token not valid", async () => {
      try {
        await tokenReview(req, res, next);
      } catch (error) {
        expect(error.errorCode).toEqual(401);
        expect(error.message).toEqual("TOKEN_INVALID");
      }
    });

    // User story 3 testing
    test("addAccount testing - case elasticSearch error", async () => {
      try {
        req.body = mockReqBody;
        await addAccount(req, res, next);
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    // User story 4 testing
    test("changeAccoutnInfomation testing - case elasticSearch error", async () => {
      try {
        req.body = mockReqBody;
        await changeAccoutnInfomation(req, res, next);
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    // User story 5 testing
    test("getAllAccounts testing - case elasticSearch error ", async () => {
      try {
        await getAllAccounts(req, res, next);
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    // User story 6 testing
    test("getAccountInfoById testing - case elasticSearch error", async () => {
      try {
        await getAccountInfoById(req, res, next);
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });

    // User story 7 testing
    test("signUp testing - case elasticSearch error", async () => {
      try {
        req.body = {
          username: "testingName",
          password: "testingPW",
          passwordConfirm: "testingPW",
          fullname: "testing",
          address: "testing",
          email: "testing@gmail.com",
        };
        await signUp(req, res, next);
      } catch (error) {
        expect(error.errorCode).toEqual(500);
        expect(error.message).toEqual("SERVER_INTERNAL_ERROR");
      }
    });
  });
});
