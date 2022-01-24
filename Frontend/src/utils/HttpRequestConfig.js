const authEndpoint = "http://localhost:3001/auths";
const todolistEndpoint = "http://localhost:3000/todolist";

export const getUserRequestConfig = {
  login: (loginInfo) => ({
    url: `${authEndpoint}/login`,
    method: "POST",
    body: loginInfo,
  }),
  signup: (signupInfo) => ({
    url: `${authEndpoint}/signup`,
    method: "POST",
    body: signupInfo,
  }),
  addUser: (userInfo, token) => ({
    url: `${authEndpoint}`,
    method: "POST",
    body: userInfo,
    token,
  }),
  editUser: (userId, token, userInfo) => ({
    url: `${authEndpoint}/${userId}`,
    method: "PUT",
    body: userInfo,
    token,
  }),
  getUserById: (userId, token) => ({
    url: `${authEndpoint}/${userId}`,
    method: "GET",
    token,
  }),
  getUserList: (token) => ({
    url: `${authEndpoint}`,
    method: "GET",
    token,
  }),
};

export const getListRequestConfig = {
  getListByOffset: (offset, token) => ({
    url: `${todolistEndpoint}/lazyloading/${offset}`,
    method: "GET",
    token,
  }),
  getList: (token) => ({
    url: `${todolistEndpoint}`,
    method: "GET",
    token,
  }),
  addTask: (newTask, token) => ({
    url: `${todolistEndpoint}/add`,
    method: "POST",
    body: {
      name: newTask.name,
      status: newTask.status,
      priority: newTask.priority,
    },
    token,
  }),
  editTask: (editedTask, token) => ({
    url: `${todolistEndpoint}/${editedTask.id}`,
    method: "PUT",
    body: {
      name: editedTask.name,
      status: editedTask.status,
      priority: editedTask.priority,
    },
    token,
  }),
  deleteTask: (id, token) => ({
    url: `${todolistEndpoint}/${id}`,
    method: "DELETE",
    token,
  }),
};
