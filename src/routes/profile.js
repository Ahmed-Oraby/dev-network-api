const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const Profile = require('../models/Profile');
const {
	validateProfile,
	validateEducation,
	validateExperience,
	validateId,
} = require('../middleware/validateProfile');

const router = express.Router();

//get own profile
router.get('/me', verifyToken, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.body.user.id }).populate(
			'user',
			'name avatar'
		);
		if (!profile) {
			return res.status(400).send({ message: 'Profile was not found.' });
		}

		res.send(profile);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Server error.' });
	}
});

//create and update profile
router.post('/', [verifyToken, validateProfile], async (req, res) => {
	try {
		const profileObject = {
			...req.body,
			user: req.body.user.id,
		};

		const userProfile = await Profile.findOne({ user: profileObject.user });

		if (userProfile) {
			const newProfile = await Profile.findOneAndUpdate(
				{ user: profileObject.user },
				profileObject,
				{ new: true }
			).populate('user', 'name avatar');
			return res.send(newProfile);
		}

		let profile = new Profile(profileObject);
		await profile.save();
		await profile.populate('user', 'name avatar');
		res.send(profile);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Server error' });
	}
});

//get all profiles
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', 'name avatar');
		res.send(profiles);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Server error' });
	}
});

//get user profile by id
router.get('/user/:id', validateId, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.params.id }).populate(
			'user',
			'name avatar'
		);
		if (!profile) {
			return res.status(400).send({ message: 'Profile was not found' });
		}

		res.send(profile);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Server error' });
	}
});

//update profile to add education
router.put('/education', [verifyToken, validateEducation], async (req, res) => {
	try {
		const educationObject = {
			...req.body,
			user: req.body.user.id,
		};

		const profile = await Profile.findOne({ user: educationObject.user });

		if (!profile) {
			return res.status(400).send({ message: 'Profile was not found.' });
		}

		profile.education.unshift(educationObject);
		await profile.save();
		await profile.populate('user', 'name avatar');
		res.send(profile);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Server error' });
	}
});

//delete education by id
router.delete('/education/:id', [verifyToken, validateId], async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.body.user.id });

		const eduObject = profile.education.find((item) => item._id.toString() === req.params.id);
		if (!eduObject) {
			return res.status(400).send('Education was not found.');
		}

		const index = profile.education.indexOf(eduObject);
		profile.education.splice(index, 1);
		await profile.save();
		await profile.populate('user', 'name avatar');
		res.send(profile);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Server error' });
	}
});

//update profile to add experience
router.put('/experience', [verifyToken, validateExperience], async (req, res) => {
	try {
		const experienceObject = {
			...req.body,
			user: req.body.user.id,
		};

		const profile = await Profile.findOne({ user: experienceObject.user });

		if (!profile) {
			return res.status(400).send({ message: 'Profile was not found.' });
		}

		profile.experience.unshift(experienceObject);
		await profile.save();
		await profile.populate('user', 'name avatar');
		res.send(profile);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Server error' });
	}
});

//delete experience by id
router.delete('/experience/:id', [verifyToken, validateId], async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.body.user.id });

		const expObject = profile.experience.find((item) => item._id.toString() === req.params.id);
		if (!expObject) {
			return res.status(400).send('Experience was not found.');
		}

		const index = profile.experience.indexOf(expObject);
		profile.experience.splice(index, 1);
		await profile.save();
		await profile.populate('user', 'name avatar');
		res.send(profile);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Server error' });
	}
});

module.exports = router;
