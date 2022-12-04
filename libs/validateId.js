const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = (id) => {
	const schema = Joi.objectId();

	const validation = schema.validate(id);
	if (validation.error) {
		return false;
	}

	return true;
};
