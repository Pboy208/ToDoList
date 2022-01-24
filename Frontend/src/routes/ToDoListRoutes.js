import { Route, Switch } from "react-router-dom";
import React from "react";
const TaskNotFound = React.lazy(() => import("../pages/TaskNotFound"));
const TaskEditing = React.lazy(() => import("../pages/task/TaskEditing"));
const TaskAdding = React.lazy(() => import("../pages/task/TaskAdding"));
const ToDoList = React.lazy(() => import("../pages/task/ToDoList"));

const ToDoListRoutes = () => {
  return (
    <Switch>
      <Route path='/todolist' exact>
        <ToDoList />
      </Route>

      <Route path='/todolist/add'>
        <TaskAdding />
      </Route>

      <Route path='/todolist/edit/:taskId'>
        <TaskEditing />
      </Route>

      <Route path='/todolist/*'>
        <TaskNotFound message='No page found!' />
      </Route>
    </Switch>
  );
};

export default ToDoListRoutes;
