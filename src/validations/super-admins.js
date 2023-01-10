import Joi from 'joi';

const validateCreation = (req, res, next) => {
  const superAdminsValidation = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    lastName: Joi.string().min(1).max(20).required(),
    email: Joi.string().min(1).max(100).required(),
    password: Joi.string().min(1).max(100).required(),
  });

  const validation = superAdminsValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.details[0].message}`,
      date: undefined,
      error: true,
    });
  }
  return next();
};

const validateEdit = (req, res, next) => {
  const superAdminsValidation = Joi.object({
    name: Joi.string().min(1).max(20),
    lastName: Joi.string().min(1).max(20),
    email: Joi.string().min(1).max(100),
    password: Joi.string().min(1).max(100),
  });

  const validation = superAdminsValidation.validate(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: `There was an error: ${validation.error.details[0].message}`,
      date: undefined,
      error: true,
    });
  }
  return next();
};
export default {
  validateCreation,
  validateEdit,
};
