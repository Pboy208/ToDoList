import { getUserRequestConfig } from "../../utils/HttpRequestConfig";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHttpClient } from "../../hooks/http-hook";
import UserInformation from "../../components/user/UserInformation";
import React from "react";
import Card from "../../components/ui/Card";
import "./UserList.css";

const UserList = React.memo(() => {
  const [transaltion] = useTranslation();

  const [userList, setUserList] = useState([]);
  const browserHistory = useHistory();
  const sendRequest = useHttpClient();

  useEffect(() => {
    const getUserList = async () => {
      const requestConfig = getUserRequestConfig.getUserList(localStorage.getItem("token"));
      const res = await sendRequest(requestConfig);
      if (!res) return;
      setUserList(res.data);
    };
    return getUserList();
  }, [sendRequest, browserHistory]);

  return (
    <>
      {userList.length !== 0 ? (
        <div className='user-list-wrapper'>
          <Link to='/user/register' className='add-new-account-btn'>
            {transaltion("add_new_account")}
          </Link>
          <Card>
            <section className='user-list'>
              <div className='user-list__header'>
                <p>{transaltion("username")}</p>
                <p>{transaltion("full_name")}</p>
                <p>{transaltion("email")}</p>
                <p>{transaltion("address")}</p>
              </div>
              <div className='user-list__body'>
                {userList.map((user) => (
                  <UserInformation user={user} key={user.id} />
                ))}
              </div>
            </section>
          </Card>
        </div>
      ) : null}
    </>
  );
});

export default UserList;
