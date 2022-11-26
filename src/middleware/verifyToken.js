const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const secret = process.env.JWT_SECRET;

	const token = req.header('x-auth-token');
	if (!token) {
		return res.status(401).send({ message: 'Token is required.' });
	}

	try {
		const decoded = jwt.verify(token, secret);
		req.body.user = decoded.user;

		next();
	} catch (err) {
		res.status(401).send({ message: 'Not authorized.' });
	}
};
