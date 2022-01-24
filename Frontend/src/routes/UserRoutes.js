import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
const UserEditing = React.lazy(() => import("../pages/user/UserEditing"));
const UserAdding = React.lazy(() => import("../pages/user/UserAdding"));
const UserList = React.lazy(() => import("../pages/user/UserList"));

const UserRoutes = () => {
  return (
    <Switch>
      <Route path='/user/information' exact>
        <UserEditing />
      </Route>

      <Route path='/user/login' exact>
        <Redirect to='/todolist' />
      </Route>

      <Route path='/user/list' exact>
        <UserList />
      </Route>

      <Route path='/user/register' exact>
        <UserAdding />
      </Route>
    </Switch>
  );
};

export default UserRoutes;
