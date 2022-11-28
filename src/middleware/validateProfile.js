const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);

module.exports.validateProfile = (req, res, next) => {
	const schema = Joi.object({
		user: Joi.objectId(),
		company: Joi.string(),
		location: Joi.string(),
		bio: Joi.string(),
		website: Joi.string(),
		githubUserName: Joi.string(),
		status: Joi.string().required(),
		skills: Joi.array().items(Joi.string()).required(),
		social: Joi.object({
			youtube: Joi.string(),
			github: Joi.string(),
			linkedin: Joi.string(),
			twitter: Joi.string(),
		}),
	});

	const validation = schema.validate(req.body);
	if (validation.error) {
		return res.status(400).send({ message: validation.error.details[0].message });
	}

	next();
};

module.exports.validateEducation = (req, res, next) => {
	const schema = Joi.object({
		user: Joi.objectId(),
		school: Joi.string().required(),
		specialization: Joi.string(),
		degree: Joi.string(),
		grade: Joi.string(),
		from: Joi.date().required(),
		to: Joi.date(),
		description: Joi.string(),
		current: Joi.boolean(),
	});

	const validation = schema.validate(req.body);
	if (validation.error) {
		return res.status(400).send({ message: validation.error.details[0].message });
	}

	next();
};

module.exports.validateExperience = (req, res, next) => {
	const schema = Joi.object({
		user: Joi.objectId(),
		company: Joi.string().required(),
		title: Joi.string().required(),
		from: Joi.date().required(),
		to: Joi.date(),
		description: Joi.string(),
		current: Joi.boolean(),
	});

	const validation = schema.validate(req.body);
	if (validation.error) {
		return res.status(400).send({ message: validation.error.details[0].message });
	}

	next();
};

module.exports.validateId = (req, res, next) => {
	const schema = Joi.object({
		id: Joi.objectId(),
	});

	const validation = schema.validate(req.params);
	if (validation.error) {
		return res.status(400).send({ message: validation.error.details[0].message });
	}

	next();
};
