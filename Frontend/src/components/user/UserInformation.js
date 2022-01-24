import "./UserInformation.css";

const UserInformation = (props) => {
  return (
    <section className="user-information">
      <p className="user-information__username">{props.user.username}</p>
      <p className="user-information__fullname">{props.user.fullname}</p>
      <p className="user-information__email">{props.user.email}</p>
      <p className="user-information__address">{props.user.address}</p>
    </section>
  );
};

export default UserInformation;
