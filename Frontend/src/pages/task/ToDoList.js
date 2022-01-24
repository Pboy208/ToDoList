import React, { useCallback, useEffect, useRef } from "react";
import { getListRequestConfig } from "../../utils/HttpRequestConfig";
import { todolistActions } from "../../store/todolist-slice";
import { useTranslation } from "react-i18next";
import { useHttpClient } from "../../hooks/http-hook";
import { useDispatch, useSelector } from "react-redux";
import TaskNotFound from "../TaskNotFound";
import TaskItem from "../../components/tasks/TaskItem";
import "./ToDoList.css";

const ToDoList = () => {
  const sendRequest = useHttpClient();
  const [translation] = useTranslation();
  const dispatch = useDispatch();
  const { hasMore, offset, nextOffset, list } = useSelector((state) => state.toDoList);

  useEffect(() => {
    const getListByOffset = async () => {
      const token = localStorage.getItem("token");
      const requestConfig = getListRequestConfig.getListByOffset(offset, token);
      const resData = await sendRequest(requestConfig);
      if (!resData) return;
      resData.length === 0 ? dispatch(todolistActions.setHasMore(false)) : dispatch(todolistActions.appendList(resData));
    };

    if (hasMore && offset === nextOffset) {
      getListByOffset();
    }
  }, [offset, nextOffset, hasMore, sendRequest, dispatch]);

  const observer = useRef();

  const lastTaskRef = useCallback(
    (lastTaskElement) => {
      observer.current?.disconnect();
      observer.current = new IntersectionObserver((entries) => entries[0].isIntersecting && hasMore && dispatch(todolistActions.setOffset()));
      if (lastTaskElement) {
        observer.current.observe(lastTaskElement);
      }
    },
    [hasMore, dispatch]
  );

  if (!list || list.length === 0) {
    return <TaskNotFound message="TODOLIST_EMPTY" />;
  }

  return (
    <div className="wrapper">
      <div className="columns-title">
        <span>{translation("field-title.name")}</span>
        <span>{translation("field-title.status")}</span>
        <span>{translation("field-title.priority")}</span>
      </div>
      <ul className="list">
        {list.map((task, index) => {
          const isLastTask = index === list.length - 1;
          return (
            <TaskItem
              lastTaskRef={isLastTask ? lastTaskRef : null}
              key={task.id}
              id={task.id}
              name={task.name}
              priority={task.priority}
              status={task.status}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ToDoList;
