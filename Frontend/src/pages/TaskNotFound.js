import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import "./not-found.css";

const TaskNotFound = (props) => {
  const [translation] = useTranslation();
  return (
    <Card>
      <div className='not-found centered'>
        <p>{translation(props.message)}</p>
        <Link to='/todolist/add' className='btn'>
          {translation("add_task")}
        </Link>
      </div>
    </Card>
  );
};

export default TaskNotFound;
