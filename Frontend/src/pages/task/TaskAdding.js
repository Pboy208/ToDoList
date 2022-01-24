import TaskForm from "../../components/tasks/TaskForm";

const TaskAdding = () => {
  const newTask = () => {
    return {
      id: 0,
      priority: "",
      status: "",
      name: "",
    };
  };

  return <TaskForm chosenTask={newTask()} isEditForm={false} />;
};

export default TaskAdding;
