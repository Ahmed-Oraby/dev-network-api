const Joi = require('joi');

const schema = Joi.object({
	name: Joi.string().alphanum().required().min(3).max(50),
	email: Joi.string().email().required(),
	password: Joi.string().required().min(5).max(255),
});

module.exports = async (req, res, next) => {
	const validation = schema.validate(req.body);
	if (validation.error) {
		return res.status(400).send(validation.error.details[0].message);
	}

	next();
};
