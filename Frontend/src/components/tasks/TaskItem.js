import { useLocation, useHistory } from "react-router-dom";
import { getListRequestConfig } from "../../utils/HttpRequestConfig";
import { todolistActions } from "../../store/todolist-slice";
import { useTranslation } from "react-i18next";
import { useHttpClient } from "../../hooks/http-hook";
import { useDispatch } from "react-redux";
import { useState } from "react";
import DeletePrompt from "../prompts/DeletePrompt";
import "./TaskItem.css";

const TaskItem = (props) => {
  const sendRequest = useHttpClient();

  const [translation] = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [isPromptShow, setIsPromptShow] = useState(false);
  const dispatch = useDispatch();

  const toEdit = () => {
    console.log(location.pathname, props.id);
    return history.push(`${location.pathname}/edit/${props.id}`);
  };

  const showPrompt = () => {
    return setIsPromptShow(true);
  };

  const choiceHandler = async (choice) => {
    setIsPromptShow(false);
    if (!choice) return;

    const token = localStorage.getItem("token");
    const requestConfig = getListRequestConfig.deleteTask(props.id, token);
    const resData = await sendRequest(requestConfig);
    if (!resData) return;
    return dispatch(todolistActions.removeFromList(props.id));
  };

  return (
    <li className="task" ref={props.lastTaskRef ? props.lastTaskRef : null}>
      <span className="task__info">
        <div className="task__info__name">{props.name}</div>
        <div className="task__info__status">{translation(props.status)}</div>
        <div className="task__info__priority">{translation(props.priority)}</div>
      </span>
      <span className="task__action">
        <div className="edit-btn" onClick={toEdit} data-testid={`edit-btn-${props.id}`}>
          <i className="fas fa-pencil-alt"></i>
        </div>
        <div className="delete-btn" onClick={showPrompt} data-testid={`delete-btn-${props.id}`}>
          <i className="fas fa-trash"></i>
        </div>
      </span>
      {isPromptShow ? <DeletePrompt choiceHandler={choiceHandler} /> : null}
    </li>
  );
};

export default TaskItem;
