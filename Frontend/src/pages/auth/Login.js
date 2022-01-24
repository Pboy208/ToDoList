import { getUserRequestConfig } from "../../utils/HttpRequestConfig";
import { useHttpClient } from "../../hooks/http-hook";
import { userActions } from "../../store/user-slice";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Card from "../../components/ui/Card";
import jwt from "jwt-decode";
import "./Login.css";
import { tokenActions } from "../../store/token-slice";
import { useForm } from "../../hooks/form-hook";
import { useHistory } from "react-router-dom";

const Login = () => {
  const sendRequest = useHttpClient();
  const dispatch = useDispatch();
  const [translation] = useTranslation();
  const browserHistory = useHistory();
  console.log("render login");
  const { formInputs, error, onChangeHandler, validateInputs } = useForm({
    username: "",
    password: "",
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const requestConfig = getUserRequestConfig.login(formInputs);
    const res = await sendRequest(requestConfig);
    if (!res) {
      return;
    }

    const decodedData = jwt(res.token);
    const user = {
      fullname: decodedData.fullname,
      email: decodedData.email,
      address: decodedData.address,
      username: decodedData.username,
      id: decodedData.userId,
    };
    localStorage.setItem("token", res.token);
    dispatch(tokenActions.setTokenIsValid());
    dispatch(userActions.setUser(user));
  };

  const toSignUp = (event) => {
    event.preventDefault();
    return browserHistory.push("/user/signup");
  };

  return (
    <Card>
      <form className="login" onSubmit={submitHandler}>
        <div className="login__label">{translation("login_required")}</div>
        <div className="login__username">
          <label>{translation("username")}</label>
          <input type="text" id="username" value={formInputs.username} onChange={onChangeHandler} />
          <p>{error.username}</p>
        </div>
        <div className="login__password">
          <label>{translation("password")}</label>
          <input type="password" id="password" value={formInputs.password} onChange={onChangeHandler} />
          <p>{error.password}</p>
        </div>
        <div className="login__btns">
          <button className="login__login-btn btn">{translation("login")}</button>
          <button className="login__signup-btn btn" onClick={toSignUp}>
            {translation("signup")}
          </button>
        </div>
      </form>
    </Card>
  );
};
export default Login;
