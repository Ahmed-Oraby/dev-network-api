const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
	try {
		const salt = await bcrypt.genSalt(10);
		req.body.password = await bcrypt.hash(req.body.password, salt);

		next();
	} catch (err) {
		console.log(err);
		res.status(500).send('Server error.');
	}
};
