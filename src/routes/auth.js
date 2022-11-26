const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.body.user.id).select(['-password', '-__v']);

		res.send(user);
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal server error.');
	}
});

module.exports = router;
