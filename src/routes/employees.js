import express from 'express';
import employeeControllers from '../controllers/employees';
import employeeValidations from '../validations/employees';

const router = express.Router();

router
  .put('/:id', employeeValidations.validateEdition, employeeControllers.editEmployee)
  .delete('/:id', employeeControllers.deleteEmployee)
  .get('/', employeeControllers.getAllEmployees)
  .get('/:id', employeeControllers.getEmployeeById)
  .post('/', employeeValidations.validateCreation, employeeControllers.createEmployee);

export default router;
