import express from 'express';
import timesheetsControllers from '../controllers/timesheets';
import timesheetsValidation from '../validations/timesheets';

const router = express.Router();

router
  .put('/', timesheetsControllers.missingId)
  .delete('/', timesheetsControllers.missingId)
  .post('/', timesheetsValidation.validateCreation, timesheetsControllers.createTimesheet)
  .get('/', timesheetsControllers.getAllTimesheets)
  .get('/:id', timesheetsControllers.getTimesheetById)
  .put('/:id', timesheetsValidation.validateUpdate, timesheetsControllers.editTimesheetById)
  .delete('/:id', timesheetsControllers.deleteTimesheetById);

export default router;
