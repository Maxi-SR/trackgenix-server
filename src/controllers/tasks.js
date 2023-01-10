import Tasks from '../models/Tasks';

const responseHandler = (res, statusCode, msg, data) => res.status(statusCode).json({
  message: msg,
  data,
  error: statusCode >= 400,
});
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find();
    if (tasks.length <= 0) {
      return res.status(404).json({
        message: 'No tasks found, empty DB.',
        data: undefined,
        error: true,
      });
    }
    const params = JSON.parse(JSON.stringify(req.query).toLocaleLowerCase());
    params.description = new RegExp(params.description, 'i');
    const keys = Object.keys(params);
    if (keys.length === 0) {
      return responseHandler(res, 200, 'Tasks found.', tasks);
    }
    keys[0] = keys[0].toLowerCase();
    if (keys.length !== 1 || keys[0] !== 'description') {
      return responseHandler(res, 400, 'There is one or more invalid params.');
    }
    const foundTasks = await Tasks.find(params);
    if (foundTasks.length <= 0) {
      return responseHandler(res, 404, 'Params does not match any task.');
    }
    const message = foundTasks.length > 1 ? 'Tasks found' : 'Task found';
    return responseHandler(res, 200, message, foundTasks);
  } catch (error) {
    const message = `An error occured: ${error.message}`;
    return responseHandler(res, 400, message);
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Tasks.findById(id);
    if (!task || task === null) {
      const message = `The following ID: '${req.params.id}' does not match any task.`;
      return responseHandler(res, 404, message);
    }
    return responseHandler(res, 200, 'Task found', task);
  } catch (error) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const message = `The following ID: '${req.params.id}'
does not match any task. Invalid format.`;
      return responseHandler(res, 404, message);
    }
    const message = `An error occured: ${error.message}`;
    return responseHandler(res, 500, message);
  }
};
const createTask = async (req, res) => {
  try {
    const admin = new Tasks({
      description: req.body.description,
    });

    const result = await admin.save();
    return res.status(201).json({
      message: 'Task created successfully',
      data: result,
      error: false,
    });
  } catch (error) {
    return res.json({
      message: 'An error occurred, Task not created',
      error: true,
    });
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Tasks.findByIdAndDelete(id);
    if (result === null) {
      const message = `The following ID: '${req.params.id}' does not match any task.`;
      return res.status(404).json({
        message,
        data: undefined,
        error: true,
      });
    }
    return responseHandler(res, 204, 'Task deleted successfully.', result);
  } catch (error) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const message = `The following ID: '${req.params.id}' does not match any task.`;
      return res.status(404).json({
        message,
        data: undefined,
        error: true,
      });
    }
    const message = `An error occured: ${error.message}`;
    return res.status(404).json({
      message,
      data: undefined,
      error: true,
    });
  }
};
const editTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Tasks.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true },
    );
    const message = `The following ID: '${req.params.id}' does not match any task.`;
    if (!result) return responseHandler(res, 404, message);
    return responseHandler(res, 201, 'Task edited successfully.', result);
  } catch (error) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const message = `The following ID: '${req.params.id}' does not match any task.`;
      return responseHandler(res, 404, message);
    }
    const message = `An error occured: ${error.message}`;
    return responseHandler(res, 400, message);
  }
};
export default {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask,
  editTask,
};
