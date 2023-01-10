import Joi from 'joi';
import { now } from 'mongoose';

const validateCreation = (req, res, next) => {
  const timesheetValidation = Joi.object({
    description: Joi.string().min(3).max(50).required(),
    date: Joi.date().max(now().toDateString()).required(),
    task: Joi.string().pattern(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
    project: Joi.string().pattern(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
    hours: Joi.number().min(1).required(),
    employee: Joi.string().pattern(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
  });

  const validation = timesheetValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.details[0].message}`,
      data: undefined,
      error: true,
    });
  }
  return next();
};

const validateUpdate = (req, res, next) => {
  const timesheetValidation = Joi.object({
    description: Joi.string().min(3).max(50),
    date: Joi.date().max(now().toDateString()),
    task: Joi.string().pattern(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
    project: Joi.string().pattern(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
    hours: Joi.number().min(1),
    employee: Joi.string().pattern(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
  });

  const validation = timesheetValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.details[0].message}`,
      data: undefined,
      error: true,
    });
  }
  return next();
};

export default {
  validateCreation,
  validateUpdate,
};
