import express from 'express';
import superAdminsControlles from '../controllers/super-admins';
import superAdminsValidations from '../validations/super-admins';

const router = express.Router();

router
  .get('/', superAdminsControlles.getAllSuperAdmins)
  .get('/:id', superAdminsControlles.getSuperAdminsById)
  .post('/', superAdminsValidations.validateCreation, superAdminsControlles.createSuperAdmin)
  .delete('/:id', superAdminsControlles.deletedSuperAdmin)
  .put('/:id', superAdminsValidations.validateEdit, superAdminsControlles.editedSuperAdmin);

export default router;
