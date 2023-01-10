import Joi from 'joi';

const validateCreation = (req, res, next) => {
  const employeeValidation = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]+$/).length(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    projects: Joi.array().min(1),
    status: Joi.boolean(),
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

const validateEdition = (req, res, next) => {
  const employeeValidation = Joi.object({
    name: Joi.string().min(3).max(50),
    lastName: Joi.string().min(3).max(50),
    phone: Joi.string().pattern(/^[0-9]+$/).length(10),
    email: Joi.string().email(),
    password: Joi.string().min(8),
    projects: Joi.array().min(1),
    status: Joi.boolean(),
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
  validateEdition,
};
