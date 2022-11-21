const express = require('express');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const User = require('../models/User');
const validateUser = require('../middleware/validateUser');
const hashPassword = require('../middleware/hashPassword');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', (req, res) => {
	res.send('users endpoint');
});

router.post('/register', [validateUser, hashPassword], async (req, res) => {
	try {
		const { name, email, password } = req.body;

		//check if user already exists
		let regiseredUser = await User.findOne({ email });
		if (regiseredUser) {
			return res.status(400).send('User already exists.');
		}

		const avatar = gravatar.url(email, {
			s: '200',
			r: 'g',
			d: 'mp',
			protocol: 'https',
		});

		//create new user and save to the database
		let user = new User({
			name,
			email,
			password,
			avatar,
		});
		user = await user.save();

		//implement jwt
		const payload = {
			user: {
				id: user.id,
			},
		};
		const secret = process.env.JWT_SECRET;
		const token = jwt.sign(payload, secret, { expiresIn: '2h' });

		res.send(token);
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal server error.');
	}
});

router.post('/login', [validateUser, verifyToken], async (req, res) => {
	try {
		res.send('verified');
	} catch (err) {
		console.log(err);
		res.status(500).send('Internal server error.');
	}
});

module.exports = router;
