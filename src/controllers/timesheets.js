import Timesheets from '../models/Timesheets';

const { ObjectId } = require('mongoose').Types;

const missingId = async (req, res) => res.status(400).json({
  message: 'Missing id parameter',
  data: undefined,
  error: true,
});

const error400 = (res, msg) => res.status(400).json({
  message: msg,
  data: undefined,
  error: true,
});

const error404 = (res, msg) => res.status(404).json({
  message: msg,
  data: undefined,
  error: true,
});

const createTimesheet = async (req, res) => {
  try {
    const timesheet = new Timesheets({
      description: req.body.description,
      date: req.body.date,
      task: req.body.task,
      project: req.body.project,
      hours: req.body.hours,
      employee: req.body.employee,
    });

    const result = timesheet.save((error, dataTimesheet) => {
      if (error) {
        return res.status.json({
          message: error,
          data: undefined,
          error: true,
        });
      }

      return res.status(201).json({
        message: 'Timesheet created',
        data: dataTimesheet,
        error: false,
      });
    });
    return result;
  } catch (error) {
    return res.status.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const getAllTimesheets = async (req, res) => {
  try {
    const allTimesheets = await Timesheets.find().populate('task').populate('employee').populate('project');
    const queryParams = Object.keys(req.query);
    const queryTimesheets = await Timesheets.find(req.query);
    const keys = ['description', 'date', 'task'];
    let includes = true;

    if (queryParams.length <= 0) {
      if (allTimesheets.length <= 0 || allTimesheets === null) {
        return error404(res, 'No timesheets in the database');
      }
      return res.status(200).json({
        message: 'Timesheets found',
        data: allTimesheets,
        error: false,
      });
    }

    queryParams.forEach((element) => {
      element.toLowerCase();
      if (!keys.includes(element)) {
        includes = false;
      }
      return includes;
    });

    if (!includes) return error400(res, 'Parameters are incorrect');
    if (queryTimesheets.length > 0) {
      return res.status(200).json({
        message: queryTimesheets.length === 1 ? 'Timesheet found' : 'Timesheets found',
        data: queryTimesheets,
        error: false,
      });
    }
    return error404(res, 'No matches');
  } catch (error) {
    return res.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const getTimesheetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return error400(res, 'Invalid ID');

    const timesheet = await Timesheets.findById(id).populate('task').populate('employee').populate('project');

    if (!timesheet) return error404(res, 'Timesheet ID not found on database');

    return res.status(200).json({
      message: 'Timesheet found',
      data: timesheet,
      error: false,
    });
  } catch (error) {
    return res.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const editTimesheetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return error404(res, 'Invalid ID');

    const updatedTimesheet = req.body;

    if (Object.entries(updatedTimesheet).length === 0 || !updatedTimesheet) {
      return error400(res, 'Edited timesheet is empty');
    }

    const result = await Timesheets.findByIdAndUpdate(id, updatedTimesheet, { new: true })
      .populate('task')
      .populate('employee')
      .populate('project');

    if (!result) return error404(res, 'Timesheet ID not found on database');

    return res.status(200).json({
      message: 'Timesheet edited',
      data: result,
      error: false,
    });
  } catch (error) {
    return res.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const deleteTimesheetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return error404(res, 'Invalid ID');

    const findById = await Timesheets.findById(id);

    if (!findById) return error404(res, 'Timesheet does not exist');

    await Timesheets.deleteOne({ _id: id });
    return res.status(204).json();
  } catch (error) {
    return res.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

export default {
  createTimesheet,
  getAllTimesheets,
  getTimesheetById,
  editTimesheetById,
  deleteTimesheetById,
  missingId,
};
