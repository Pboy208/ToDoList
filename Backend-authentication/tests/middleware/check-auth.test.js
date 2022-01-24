const sinon = require("sinon");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const checkAuth = require("../../middleware/check-auth");

const mockRequest = () => {
  const req = {};
  req.body = {};
  req.params = { userId: 1 };
  req.headers = { authorization: "Bearer fakeToken" };
  req.userData = { userId: null };
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
      sandbox.stub(jwt, "verify").callsFake(() => ({
        userId: "fakeUserId",
      }));
      sandbox.stub(User, "isIdExisted").callsFake(async () => Promise.resolve(true));

      req = mockRequest();
      res = mockRespone();
      next = jest.fn();
    });

    afterEach(() => {
      sandbox.restore();
    });

    test("preflight testing", async () => {
      req.method = "OPTIONS";
      await checkAuth(req, res, next);
      expect(next).toBeCalledWith();
    });

    test("auth valid testing", async () => {
      await checkAuth(req, res, next);
      expect(next).toBeCalledWith();
      expect(req.userData.userId).toEqual("fakeUserId");
    });
  });
  //-------------------------------------------------------------------------------------------
  describe("Throw Error", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      req = mockRequest();
      res = mockRespone();
      next = jest.fn();
    });

    afterEach(() => {
      sandbox.restore();
    });

    test("Token not found testing", async () => {
      sandbox.stub(jwt, "verify").callsFake(() => ({
        userId: "fakeUserId",
      }));
      req.headers.authorization = "Bearer ";
      await checkAuth(req, res, next);
      expect(next).toBeCalledWith(new Error("AUTHORIZATION_FAILED"));
    });

    test("Invalid id testing", async () => {
      sandbox.stub(jwt, "verify").callsFake(() => ({
        userId: "fakeUserId",
      }));
      sandbox.stub(User, "isIdExisted").callsFake(async () => Promise.resolve(false));
      await checkAuth(req, res, next);
      expect(next).toBeCalledWith(new Error("USERID_NOT_EXISTS"));
    });
  });
});
