import { useParams } from "react-router-dom";
import TaskNotFound from "../TaskNotFound";
import TaskForm from "../../components/tasks/TaskForm";
import { useSelector } from "react-redux";

const TaskEditing = () => {
  const { list } = useSelector((state) => state.toDoList);
  const urlParams = useParams();
  const chosenId = urlParams.taskId;
  const chosenTask = list.find((task) => task.id === chosenId);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token && toDoListState.isInitialize) {
  //     dispatch(fetchData(token));
  //   }
  // }, [dispatch, toDoListState.isInitialize]);

  if (!chosenTask) {
    return <TaskNotFound message='TASK_NOTFOUND' />;
  }

  return <TaskForm chosenTask={chosenTask} isEditForm={true} />;
};

export default TaskEditing;
