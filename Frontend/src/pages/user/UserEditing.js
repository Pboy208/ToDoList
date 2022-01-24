import { useDispatch, useSelector } from "react-redux";
import { getUserRequestConfig } from "../../utils/HttpRequestConfig";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHttpClient } from "../../hooks/http-hook";
import { userActions } from "../../store/user-slice";
import PasswordRequire from "../../components/user/PasswordRequire";
import React from "react";
import Card from "../../components/ui/Card";
import "./UserEditing.css";

const UserEditing = React.memo(() => {
  const [translation] = useTranslation();
  console.log("in userEditing");
  const userState = useSelector((state) => state.user);

  const [user, setUser] = useState(userState.user);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);

  const dispatch = useDispatch();
  const sendRequest = useHttpClient();

  const isAllFieldsFilled = user ? !!user.fullname && !!user.email && !!user.address : false;
  const token = localStorage.getItem("token");

  const inputChangeHandler = (event) => {
    const value = event.target.value;
    setUser((prev) => ({
      ...prev,
      [event.target.id]: value,
    }));
  };

  const cancelPasswordRequire = () => {
    setIsPasswordRequired(false);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setIsPasswordRequired(true);
  };

  const submitPassword = async (password) => {
    setIsPasswordRequired(false);

    const requestConfig = getUserRequestConfig.editUser(user.id, token, {
      password,
      fullname: user.fullname,
      email: user.email,
      address: user.address,
    });
    const res = await sendRequest(requestConfig);
    if (res) {
      dispatch(userActions.setUser(user));
      alert(translation("ACCOUNT_UPDATED"));
    }
  };

  return (
    <>
      {isPasswordRequired ? <PasswordRequire submitPassword={submitPassword} cancelPasswordRequire={cancelPasswordRequire} /> : null}
      {user ? (
        <Card>
          <form className="user-form" onSubmit={onSubmitHandler}>
            <img className="user-form__avatar" src={window.location.origin + "/defaultAvatar.png"} alt="default avatar" />
            <label className="user-form__username">{user.username}</label>

            <div className="user-form__fullname">
              <label>{translation("full_name")}</label>
              <input id="fullname" value={user.fullname} onChange={inputChangeHandler} />
            </div>
            <div className="user-form__email">
              <label>{translation("email")}</label>
              <input id="email" value={user.email} onChange={inputChangeHandler} />
            </div>
            <div className="user-form__address">
              <label>{translation("address")}</label>
              <input id="address" value={user.address} onChange={inputChangeHandler} />
            </div>
            <button className="user-form__submit-btn save-btn btn" disabled={isAllFieldsFilled ? null : true}>
              {translation("save_btn")}
            </button>
          </form>
        </Card>
      ) : null}
    </>
  );
});

export default UserEditing;
