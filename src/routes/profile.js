const express = require('express');
const fetch = require('node-fetch').default;
const verifyToken = require('../middleware/verifyToken');
const Profile = require('../models/Profile');
const User = require('../models/User');
const {
  validateProfile,
  validateEducation,
  validateExperience,
} = require('../middleware/validateProfile');
const validateId = require('../../libs/validateId');

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

//get all profiles as pages
router.get('/', async (req, res) => {
  try {
    const pageNumber = Number(req.query.page_number) || 1;
    const pageSize = Number(req.query.page_size) || 10;
    const profiles = await Profile.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(['user', 'bio', 'location'])
      .populate('user', 'name avatar');

    res.send(profiles);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server error' });
  }
});

//get user profile by id
router.get('/user/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!validateId(userId)) {
      return res.status(404).send({ message: 'User was not found.' });
    }

    const profile = await Profile.findOne({ user: userId }).populate(
      'user',
      'name avatar'
    );
    const user = await User.findById(userId).select(['name', 'avatar']);

    if (!profile && !user) {
      return res.status(400).send({ message: 'Profile was not found' });
    }

    res.send({ profile, user });
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
router.delete('/education/:edu_id', verifyToken, async (req, res) => {
  try {
    const eduId = req.params.edu_id;

    if (!validateId(eduId)) {
      return res.status(404).send({ message: 'Education was not found.' });
    }

    const profile = await Profile.findOne({ user: req.body.user.id });

    const eduObject = profile.education.find(
      (item) => item._id.toString() === eduId
    );
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
router.put(
  '/experience',
  [verifyToken, validateExperience],
  async (req, res) => {
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
  }
);

//delete experience by id
router.delete('/experience/:exp_id', verifyToken, async (req, res) => {
  try {
    const expId = req.params.exp_id;

    if (!validateId(expId)) {
      return res.status(404).send({ message: 'Experience was not found.' });
    }

    const profile = await Profile.findOne({ user: req.body.user.id });

    const expObject = profile.experience.find(
      (item) => item._id.toString() === expId
    );
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

//get github repos
router.get('/github/:username', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created&direction=asc`
    );
    const data = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).send({ message: data.message });
    }

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server error' });
  }
});

module.exports = router;
