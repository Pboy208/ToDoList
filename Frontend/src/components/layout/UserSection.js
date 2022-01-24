import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { userActions } from "../../store/user-slice";
import "./UserSection.css";

const UserSection = () => {
  const dispatch = useDispatch();
  const browserHistory = useHistory();
  const userState = useSelector((state) => state.user);
  const user = userState.user;
  const [translation] = useTranslation();

  const logOut = () => {
    dispatch(userActions.clearUser());
    localStorage.removeItem("token");
    browserHistory.push(`/user/login`);
  };

  const userSection = () => {
    return (
      <>
        <div className='user-section__infomation'>
          <label>{`${translation("hello")} ${user.username}`}</label>
          <i className='fas fa-sort-down'></i>
          <ul className='selections'>
            <li>
              <Link to='/user/information'>{translation("user_information")}</Link>
            </li>
            <li>
              <Link to='/user/list'>{translation("all_accounts")}</Link>
            </li>
            <li onClick={logOut}>{translation("logout")}</li>
          </ul>
        </div>
      </>
    );
  };

  const toLogin = () => {
    return (
      <Link to='/user/login' className='to-login-btn'>
        {translation("to_login")}
      </Link>
    );
  };

  return <section className='user-section'>{user ? userSection() : toLogin()}</section>;
};

export default UserSection;
