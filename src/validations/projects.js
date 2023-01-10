import Joi from 'joi';
import { now } from 'mongoose';

const validateCreation = (req, res, next) => {
  const employeeValidation = Joi.object({
    employeeId: Joi.string().hex().length(24).required(),
    role: Joi.string().valid('DEV', 'QA', 'TL').required(),
    rate: Joi.number().required(),
  });

  const projectValidation = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    startDate: Joi.date().max(now().toDateString()).required(),
    endDate: Joi.date().max(now().toDateString()).required(),
    clientName: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(50).required(),
    employees: Joi.array().items(employeeValidation),
    status: Joi.boolean(),
  });

  const validation = projectValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.details[0].message}`,
      data: undefined,
      error: true,
    });
  }
  return next();
};

const validateEdit = (req, res, next) => {
  const employeeValidation = Joi.object({
    employeeId: Joi.string().hex().length(24).required(),
    role: Joi.string().valid('DEV', 'QA', 'TL'),
    rate: Joi.number(),
  });

  const projectValidation = Joi.object({
    name: Joi.string().min(3).max(50),
    startDate: Joi.date().max(now().toDateString()),
    endDate: Joi.date().max(now().toDateString()),
    clientName: Joi.string().min(3).max(50),
    description: Joi.string().min(3).max(50),
    employees: Joi.array().items(employeeValidation),
    status: Joi.boolean(),
  });

  const validation = projectValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.details[0].message}`,
      data: undefined,
      error: true,
    });
  }
  return next();
};

const validatePutEmployee = (req, res, next) => {
  const employeeValidation = Joi.object({
    employeeId: Joi.string().hex().length(24).required(),
    role: Joi.string().valid('DEV', 'QA', 'TL'),
    rate: Joi.number(),
  });

  const validation = employeeValidation.validate(req.body);

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
  validateEdit,
  validatePutEmployee,
};
