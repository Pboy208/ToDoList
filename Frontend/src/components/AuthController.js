import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkForTokenInStorage } from "../store/token-slice";
import { useTranslation } from "react-i18next";
import { userActions } from "../store/user-slice";
import React, { useEffect } from "react";

function AuthController(props) {
  const [translation] = useTranslation();
  const tokenState = useSelector((state) => state.token);
  const browserHistory = useHistory();
  const dispatch = useDispatch();
  console.log("in auth controller");
  useEffect(() => {
    console.log("in fetch");
    dispatch(checkForTokenInStorage());
  }, []);

  useEffect(() => {
    if (tokenState.isExpired) {
      dispatch(userActions.clearUser());
      localStorage.removeItem("token");
      browserHistory.push("/user/login");
      return alert(translation("TOKEN_EXPIRED"));
    }
  }, [tokenState.isExpired]);

  useEffect(() => {
    if (tokenState.isNotInStorage) {
      if (browserHistory.location.pathname !== "/user/login") {
        browserHistory.push("/user/login");
        return alert(translation("TOKEN_NOT_IN_STORAGE"));
      }
    }
  }, [tokenState.isNotInStorage]);

  return <>{props.children}</>;
}

export default AuthController;
