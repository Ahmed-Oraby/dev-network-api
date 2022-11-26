const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = (req, res, next) => {
	const schema = Joi.object({
		user: Joi.objectId(),
		company: Joi.string(),
		location: Joi.string(),
		bio: Joi.string(),
		website: Joi.string(),
		githubUserName: Joi.string(),
		status: Joi.string().required(),
		skills: Joi.string().required(),
		youtube: Joi.string(),
		github: Joi.string(),
		linkedin: Joi.string(),
		twitter: Joi.string(),
		// education: Joi.array().items(Joi.string(), Joi.date()),
		// experience: Joi.array().items(Joi.string(), Joi.date()),
	});

	const validation = schema.validate(req.body);
	if (validation.error) {
		return res.status(400).send({ message: validation.error.details[0].message });
	}

	next();
};
