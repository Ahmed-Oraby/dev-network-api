const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const Profile = require('../models/Profile');
const validateProfile = require('../middleware/validateProfile');

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.body.user.id }).populate('User', [
			'name',
			'avatar',
		]);
		if (!profile) {
			return res.status(400).send({ message: 'Profile was not found.' });
		}

		res.send(profile);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Server error.' });
	}
});

router.post('/', [verifyToken, validateProfile], async (req, res) => {
	const {
		user,
		company,
		status,
		skills,
		location,
		bio,
		website,
		githubUserName,
		youtube,
		github,
		twitter,
		linkedin,
	} = req.body;

	let profileObject = {};
	profileObject.user = user.id;

	if (company) profileObject.company = company;
	if (status) profileObject.status = status;
	if (location) profileObject.location = location;
	if (bio) profileObject.bio = bio;
	if (website) profileObject.website = website;
	if (githubUserName) profileObject.githubUserName = githubUserName;
	if (skills) {
		profileObject.skills = skills.split(',').map((item) => item.trim());
	}

	profileObject.social = {};

	if (youtube) profileObject.social.youtube = youtube;
	if (github) profileObject.social.github = github;
	if (linkedin) profileObject.social.linkedin = linkedin;
	if (twitter) profileObject.social.twitter = twitter;

	res.send(profileObject);
});

module.exports = router;
