const Joi = require('joi');

module.exports.validatePost = (req, res, next) => {
	const schema = Joi.object({
		user: Joi.object(),
		text: Joi.string().required(),
	});

	const validation = schema.validate(req.body);
	if (validation.error) {
		return res.status(400).send({ message: validation.error.details[0].message });
	}

	next();
};

// module.exports.validatePostId = (req, res, next) => {
// 	const schema = Joi.object({
// 		post_id: Joi.objectId(),
// 	});

// 	const validation = schema.validate(req.params);
// 	if (validation.error) {
// 		return res.status(400).send({ message: validation.error.details[0].message });
// 	}

// 	next();
// };
