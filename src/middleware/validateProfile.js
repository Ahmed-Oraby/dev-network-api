const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);

module.exports.validateProfile = (req, res, next) => {
  const schema = Joi.object({
    user: Joi.object(),
    bio: Joi.string().required(),
    location: Joi.string().required(),
    status: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).min(1).required(),
    company: Joi.string().allow(''),
    website: Joi.string().allow(''),
    githubUserName: Joi.string().allow(''),
    social: Joi.object({
      youtube: Joi.string().allow(''),
      github: Joi.string().allow(''),
      linkedin: Joi.string().allow(''),
      twitter: Joi.string().allow(''),
    }),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send({ message: validation.error.details[0].message });
  }

  next();
};

module.exports.validateEducation = (req, res, next) => {
  const schema = Joi.object({
    user: Joi.object(),
    school: Joi.string().required(),
    specialization: Joi.string().required(),
    degree: Joi.string().allow(''),
    grade: Joi.string().allow(''),
    description: Joi.string().allow(''),
    from: Joi.date().required(),
    to: Joi.date(),
    current: Joi.boolean(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send({ message: validation.error.details[0].message });
  }

  next();
};

module.exports.validateExperience = (req, res, next) => {
  const schema = Joi.object({
    user: Joi.object(),
    company: Joi.string().required(),
    title: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date(),
    description: Joi.string().allow(''),
    current: Joi.boolean(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send({ message: validation.error.details[0].message });
  }

  next();
};

// module.exports.validateId = (req, res, next) => {
// 	const schema = Joi.object({
// 		id: Joi.objectId(),
// 	});

// 	const validation = schema.validate(req.params);
// 	if (validation.error) {
// 		return res.status(400).send({ message: validation.error.details[0].message });
// 	}

// 	next();
// };
