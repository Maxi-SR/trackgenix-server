import Projects from '../models/Projects';
import Employees from '../models/Employees';

const { ObjectId } = require('mongoose').Types;

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

const createProject = async (req, res) => {
  try {
    const project = new Projects({
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      clientName: req.body.clientName,
      employees: req.body.employees,
      status: false,
    });
    const result = await project.save();
    return res.status(201).json({
      message: 'Project created',
      data: result,
      error: false,
    });
  } catch (error) {
    return res.status(400).json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projectsAll = await Projects.find().populate('employees');
    const queryParams = Object.keys(req.query);
    const find = await Projects.find(req.query);
    const keysProjects = ['name', 'employees', 'startDate', 'endDate', 'description', 'clientName'];
    let includes = true;

    if (queryParams.length <= 0) {
      if (projectsAll.length <= 0 || projectsAll === null) {
        return error404(res, 'There are no projects to show');
      }
      return res.status(200).json({
        message: 'Projects found',
        data: projectsAll,
        error: false,
      });
    }

    queryParams.forEach((element) => {
      element.toLowerCase();
      if (!keysProjects.includes(element)) {
        includes = false;
      }
      return includes;
    });
    if (!includes) return error400(res, 'Parameters are incorrect');

    if (find.length > 0) {
      return res.status(200).json({
        message: find.length === 1 ? 'Project found' : 'Projects found',
        data: find,
        error: false,
      });
    }
    return error404(res, 'Project not found');
  } catch (error) {
    return res.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return error400(res, 'Invalid ID');

    const project = await Projects.findById(id).populate('employees');
    if (!project) return error404(res, 'Project ID not found on database');

    return res.status(200).json({
      message: 'Project found',
      data: project,
      error: false,
    });
  } catch (error) {
    return res.status.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return error400(res, 'Invalid ID');

    const findById = await Projects.findById(id);
    if (!findById) return error404(res, 'Project not exist');

    await Projects.deleteOne({ _id: id });

    return res.status(204).json();
  } catch (error) {
    return res.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return error400(res, 'Invalid ID');

    const updatedProject = req.body;

    if (Object.entries(updatedProject).length === 0 || !updatedProject) {
      return error400(res, 'Edited project is empty');
    }
    const project = await Projects.findById(id);
    if (!project) return error404(res, 'Project does not exist');

    const result = await Projects.findByIdAndUpdate(id, updatedProject, { new: true });

    return res.status(200).json({
      message: 'Project has been changed',
      data: result,
      error: false,
    });
  } catch (error) {
    return res.status.json({
      message: `An error ocurred: ${error}`,
      data: undefined,
      error: true,
    });
  }
};

const addEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return error400(res, 'Invalid project ID');

    const project = await Projects.findById(id);
    if (!project) return error404(res, 'Project does not exist on DB');

    const newEmployee = req.body;
    const foundEmployee = await Employees.findById(newEmployee.employeeId);
    if (!foundEmployee) return error404(res, 'Employee does not exist on DB');

    const addEmployeedProject = await Projects.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          employees: {
            employeeId: newEmployee.employeeId,
            rate: newEmployee.rate,
            role: newEmployee.role,
          },
        },
      },
      { new: true },
    );

    return res.status(201).json({
      message: 'Employee has been added',
      data: addEmployeedProject,
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

export default {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  addEmployee,
  updateProject,
};
