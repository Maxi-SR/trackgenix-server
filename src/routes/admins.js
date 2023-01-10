import express from 'express';
import adminsControllers from '../controllers/admins';
import adminsValidations from '../validations/admins';

const router = express.Router();

router
  .put('/:id', adminsValidations.validateEdition, adminsControllers.editAdmin)
  .delete('/:id', adminsControllers.deleteAdmin)
  .get('/', adminsControllers.getAllAdmins)
  .get('/:id', adminsControllers.getAdminById)
  .post('/', adminsValidations.validateCreation, adminsControllers.createAdmin);

export default router;
