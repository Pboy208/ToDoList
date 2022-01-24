import { Redirect, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import UserInputAlert from "./components/alert/UserInputAlert";
import Layout from "./components/layout/Layout";
import React from "react";
import Login from "./pages/auth/Login";
import UserAdding from "./pages/user/UserAdding";
import { useMemo } from "react";

const ToDoListRoutes = React.lazy(() => import("./routes/ToDoListRoutes"));
const UserRoutes = React.lazy(() => import("./routes/UserRoutes"));

const App = () => {
  const overlayMessageState = useSelector((state) => state.overlayMessage);
  const userState = useSelector((state) => state.user);
  const isUserLoggedIn = !!userState.user;
  console.log("in app");

  const routesForUser = () => (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/todolist" />
      </Route>
  
      <Route path="/todolist">
        <ToDoListRoutes />
      </Route>
  
      <Route path="/user">
        <UserRoutes />
      </Route>
    </Switch>
  );
  
  const routesForNoneUser = () => (
    <Switch>
      <Route path="/user/signup" exact>
        <UserAdding />
      </Route>
  
      <Route path="/user/login" exact>
        <Login />
      </Route>
  
      <Route path="/*">
        <Redirect to="/user/login" />
      </Route>
    </Switch>
  );

  //useMemo for the layout component not to be rerendered
  const renderRoutes = useMemo(() => {
    return isUserLoggedIn ? routesForUser() : routesForNoneUser();
  }, [isUserLoggedIn]);

  return (
    <>
      {overlayMessageState.message && <UserInputAlert />}
      <Layout>{renderRoutes}</Layout>
    </>
  );
};

export default App;
