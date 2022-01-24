import Card from "../components/ui/Card";
import "./not-found.css";

const UserNotFound = (props) => {
  return (
    <Card>
      <div className='not-found centered'>
        <p>{props.message}</p>
      </div>
    </Card>
  );
};

export default UserNotFound;
