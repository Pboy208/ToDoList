import { getListRequestConfig } from "../../utils/HttpRequestConfig";
import { todolistActions } from "../../store/todolist-slice";
import { useTranslation } from "react-i18next";
import { useHttpClient } from "../../hooks/http-hook";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import Card from "../ui/Card";
import "./TaskForm.css";

const PRIORITY = ["", "LOW", "MEDIUM", "HIGH"];
const STATUS = ["", "OPEN", "IN PROGRESS", "DONE"];

const TaskForm = (props) => {
  const sendRequest = useHttpClient();

  const [translation] = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [invalidMessage, setInvalidMessage] = useState("");
  const [task, setTask] = useState(props.chosenTask);
  let isAllFieldsFullied = !!task.name && !!task.priority && !!task.status;

  const clearInvalidMessage = () => {
    return setInvalidMessage("");
  };

  const onChangeHandler = (event) => {
    if (event.target.id === "name") {
      clearInvalidMessage();
    }
    return setTask((prev) => ({ ...prev, [event.target.id]: event.target.value }));
  };

  const cancelForm = (event) => {
    event.preventDefault();
    clearInvalidMessage();
    return setTask((prev) => ({ ...prev, name: props.isEditForm ? task.name : "", priority: "", status: "" }));
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    if (task.name.length > 255) {
      setInvalidMessage("Name should be less than 255 characters");
      return;
    }
    const token = localStorage.getItem("token");
    const requestConfig = props.isEditForm ? getListRequestConfig.editTask(task, token) : getListRequestConfig.addTask(task, token);
    const resData = await sendRequest(requestConfig);

    if (!resData) return;
    props.isEditForm ? dispatch(todolistActions.changeInList(task)) : dispatch(todolistActions.addToList({ ...task, id: resData.id }));
    history.push("/");
  };

  return (
    <>
      <Card>
        <form onSubmit={submitFormHandler}>
          <div className="field" id="name_input_field">
            <label>
              {translation("field-title.name")}
              <span>*</span>
            </label>
            <input onChange={onChangeHandler} id="name" value={task.name} disabled={props.isEditForm ? true : null}></input>
            <div className="invalid-message">{invalidMessage}</div>
          </div>

          <div className="field">
            <label>
              {translation("field-title.status")}
              <span>*</span>
            </label>
            <select onChange={onChangeHandler} value={task.status} id="status">
              {STATUS.map((option, index) => (
                <option value={index === 0 ? "" : option} key={option}>
                  {translation(option)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>
              {translation("field-title.priority")}
              <span>*</span>
            </label>
            <select onChange={onChangeHandler} value={task.priority} id="priority">
              {PRIORITY.map((option, index) => (
                <option value={index === 0 ? "" : option} key={option}>
                  {translation(option)}
                </option>
              ))}
            </select>
          </div>

          <button className="cancel-btn btn" onClick={cancelForm}>
            <i className="fas fa-times"></i>
            <span>{translation("task-form.cancel-btn")}</span>
          </button>

          <button className="save-btn btn" disabled={!isAllFieldsFullied}>
            <i className="fas fa-check"></i>
            <span>{translation("task-form.save-btn")}</span>
          </button>
        </form>
      </Card>
    </>
  );
};

export default TaskForm;
