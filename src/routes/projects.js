import express from 'express';
import projectsControllers from '../controllers/projects';
import projectsValidations from '../validations/projects';

const router = express.Router();

router
  .get('/', projectsControllers.getAllProjects)
  .get('/:id', projectsControllers.getProjectById)
  .post('/', projectsValidations.validateCreation, projectsControllers.createProject)
  .delete('/:id', projectsControllers.deleteProject)
  .put('/:id', projectsValidations.validateEdit, projectsControllers.updateProject)
  .put('/:id/assignEmployee', projectsValidations.validatePutEmployee, projectsControllers.addEmployee);

export default router;
