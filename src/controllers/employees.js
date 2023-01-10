import Employees from '../models/Employees';

const { ObjectId } = require('mongoose').Types;

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employees.find().populate('projects');
    const queryParams = Object.keys(req.query);
    const find = await Employees.find(req.query).populate('projects');
    const keysProjects = ['name', 'lastName', 'phone', 'email'];
    let includes = true;

    if (queryParams.length <= 0) {
      if (employees.length <= 0 || employees === null) {
        return res.status(404).json({
          message: 'There are no employees to show',
          data: undefined,
          error: true,
        });
      }
      return res.status(200).json({
        message: 'Employees found',
        data: employees,
        error: false,
      });
    }

    queryParams.forEach((element) => {
      if (!keysProjects.includes(element)) {
        includes = false;
      }
      return includes;
    });
    if (!includes) {
      return res.status(400).json({
        message: 'An error occurred',
        data: undefined,
        error: true,
      });
    }

    if (find.length > 0) {
      return res.status(200).json({
        message: find.length === 1 ? 'Employee found' : 'Employees found',
        data: find,
        error: false,
      });
    }
    return res.status(404).json({
      message: 'Employee not found',
      data: undefined,
      error: true,
    });
  } catch (error) {
    return res.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid ID',
        data: undefined,
        error: true,
      });
    }
    const employees = await Employees.findById(id).populate('projects');
    if (!employees) {
      return res.status(404).json({
        message: 'Employee not found',
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'Employee found',
      data: employees,
      error: false,
    });
  } catch (error) {
    return res.json({
      message: `An error ocurred: ${error}`,
      date: undefined,
      error: true,
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const foundEmail = await Employees.find(
      { email: req.body.email },
    );
    if (Object.keys(foundEmail).length > 0) {
      return res.status(400).json({
        message: 'Email already exists',
        data: undefined,
        error: true,
      });
    }

    const employee = new Employees({
      name: req.body.name,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      projects: req.body.projects,
      status: false,
    });

    const result = await employee.save();

    return res.status(201).json({
      message: 'Employee successfully created',
      data: result,
      error: false,
    });
  } catch (error) {
    return res.json({
      message: 'An error occurred',
      data: undefined,
      error: true,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid ID',
        data: undefined,
        error: true,
      });
    }
    const result = await Employees.findByIdAndDelete(id);
    if (result === null) {
      return res.status(404).json({
        message: 'Employee not found',
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: `Employee with id ${id} deleted`,
      data: result,
      error: false,
    });
  } catch (error) {
    return res.json({
      message: `Server error: ${error}`,
      error: true,
    });
  }
};

const editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid ID',
        data: undefined,
        error: true,
      });
    }
    if (Object.entries(req.body).length === 0) {
      return res.status(400).json({
        message: 'You must edit at least one field',
        data: undefined,
        error: true,
      });
    }

    const findById = await Employees.findById(id).populate('projects');
    if (!findById) {
      return res.status(404).json({
        message: 'Employee does not exist',
        data: undefined,
        error: true,
      });
    }

    const result = await Employees.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true },
    ).populate('projects');

    return res.status(200).json({
      message: `Employee widh id ${id} edited`,
      data: result,
      error: false,
    });
  } catch (error) {
    return res.json({
      message: `Server error: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
  editEmployee,
};
