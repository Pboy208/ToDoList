const taskSchema = require("../schemas/task");
const Task = require("../models/task");
const HttpError = require("../models/http-error");
const { tryCatchBlockWithValidate } = require("../utils/function");

const minimizeTask = (task) => {
  const { name, status, priority, creatorId } = task;
  return {
    id: task["_id"].toString(),
    name,
    status,
    priority,
    creatorId,
  };
};

const isTaskNameExist = async (name, creatorId) => {
  const task = await Task.findOne({ name, creatorId });
  return !!task;
};

// infinity scroll
exports.getListByOffset = tryCatchBlockWithValidate(null, async (req, res, next) => {
  const toDoList = await Task.find({ creatorId: req.userData.id })
    .skip(req.params.offset * process.env.TASKS_PER_OFFSET)
    .limit(1 * process.env.TASKS_PER_OFFSET);
  const minimizedToDoList = toDoList.map((task) => minimizeTask(task));
  return res.status(200).send(minimizedToDoList);
});

//user story1
exports.getToDoList = tryCatchBlockWithValidate(null, async (req, res, next) => {
  const toDoList = await Task.findById(req.userData.id);
  const minimizedToDoList = toDoList.map((task) => minimizeTask(task));
  return res.status(200).send(minimizedToDoList);
});

//user story2
exports.addTaskToList = tryCatchBlockWithValidate(taskSchema, async (req, res, next) => {
  const taskData = { ...req.body, creatorId: req.userData.id };
  const task = new Task(taskData);

  const taskNameExist = await isTaskNameExist(task.name, task.creatorId);
  if (taskNameExist) {
    return next(new HttpError("TASK_EXISTED_NAME", 409));
  }

  await task.save();
  const taskId = task["_id"].toString();
  return res.status(200).send({ id: taskId });
});

//user story3
exports.changeTaskInList = tryCatchBlockWithValidate(taskSchema, async (req, res, next) => {
  const updateData = { ...req.body, creatorId: req.userData.id };

  const task = await Task.findByIdAndUpdate(req.params.taskId, updateData);
  if (!task) {
    return next(new HttpError("TASK_NOT_EXISTS", 404));
  }

  return res.status(200).send({});
});

//user story4
exports.deleteTaskFromList = tryCatchBlockWithValidate(null, async (req, res, next) => {
  const task = await Task.findByIdAndRemove(req.params.taskId);
  if (!task) {
    return next(new HttpError("TASK_NOT_EXISTS", 404));
  }

  return res.status(200).send({});
});
