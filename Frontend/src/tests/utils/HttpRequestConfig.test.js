import { getListRequestConfig, getUserRequestConfig } from "../../utils/HttpRequestConfig";

const authEndpoint = "http://localhost:3001/auths";
const todolistEndpoint = "http://localhost:3000/todolist";
const token = null;
const testingTask = {
  id: 1,
  name: "testing",
  status: "DONE",
  priority: "HIGH",
};

describe("HttpRequestConfig testing", () => {
  describe("getListRequestConfig testing", () => {
    test("getListByOffset testing", () => {
      const reqConfig = getListRequestConfig.getListByOffset(1, token);
      expect(reqConfig).toEqual({
        url: `${todolistEndpoint}/lazyloading/1`,
        method: "GET",
        token,
      });
    });

    test("getList testing", () => {
      const reqConfig = getListRequestConfig.getList(token);
      expect(reqConfig).toEqual({
        url: `${todolistEndpoint}`,
        method: "GET",
        token,
      });
    });

    test("addTask testing", () => {
      const reqConfig = getListRequestConfig.addTask(testingTask, token);
      expect(reqConfig).toEqual({
        url: `${todolistEndpoint}/add`,
        method: "POST",
        body: {
          name: testingTask.name,
          status: testingTask.status,
          priority: testingTask.priority,
        },
        token,
      });
    });

    test("editTask testing", () => {
      const reqConfig = getListRequestConfig.editTask(testingTask, token);
      expect(reqConfig).toEqual({
        url: `${todolistEndpoint}/${testingTask.id}`,
        method: "PUT",
        body: {
          name: testingTask.name,
          status: testingTask.status,
          priority: testingTask.priority,
        },
        token,
      });
    });

    test("deleteTask testing", () => {
      const reqConfig = getListRequestConfig.deleteTask(1, token);
      expect(reqConfig).toEqual({
        url: `${todolistEndpoint}/1`,
        method: "DELETE",
        token,
      });
    });
  });

  describe("getUserRequestConfig testing", () => {
    test("login testing", () => {
      const loginInfo = {
        username: "phuong",
        password: "phuong",
      };
      const reqConfig = getUserRequestConfig.login(loginInfo);
      expect(reqConfig).toEqual({
        url: `${authEndpoint}/login`,
        method: "POST",
        body: loginInfo,
      });
    });

    test("addUser testing", () => {
      const userInfo = "fakeUserInfo";
      const reqConfig = getUserRequestConfig.addUser(userInfo, token);
      expect(reqConfig).toEqual({
        url: `${authEndpoint}`,
        method: "POST",
        body: userInfo,
        token,
      });
    });

    test("editUser testing", () => {
      const userInfo = "fakeUserInfo";
      const reqConfig = getUserRequestConfig.editUser(1, token, userInfo);
      expect(reqConfig).toEqual({
        url: `${authEndpoint}/1`,
        method: "PUT",
        body: userInfo,
        token,
      });
    });

    test("getUserById testing", () => {
      const reqConfig = getUserRequestConfig.getUserById(1, token);
      expect(reqConfig).toEqual({
        url: `${authEndpoint}/1`,
        method: "GET",
        token,
      });
    });

    test("getUserList testing", () => {
      const reqConfig = getUserRequestConfig.getUserList(token);
      expect(reqConfig).toEqual({
        url: `${authEndpoint}`,
        method: "GET",
        token,
      });
    });
  });
});
