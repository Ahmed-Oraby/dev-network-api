const Joi = require('joi');

module.exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(12),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5).max(255),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send({ message: validation.error.details[0].message });
  }

  next();
};

module.exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5).max(255),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send({ message: validation.error.details[0].message });
  }

  next();
};
