const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const User = require('../models/User');
const Profile = require('../models/Profile');
const {
  validateLogin,
  validateRegister,
} = require('../middleware/validateUser');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('users endpoint');
});

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if user already exists
    let regiseredUser = await User.findOne({ email });
    if (regiseredUser) {
      return res.status(400).send({ message: 'User already exists.' });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //generate avatar
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
      password: hashedPassword,
      avatar,
    });
    user = await user.save();

    //create token and send it to client
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
    };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });

    res.send({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server error.' });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    //check if user exists
    if (!user) {
      return res.status(403).send({ message: 'Invalid email or password.' });
    }

    //check if password is correct
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(403).send({ message: 'Invalid email or password.' });
    }

    //user is logged in
    //create token and send it to client
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
    };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });

    res.send({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server error.' });
  }
});

//delete own user, profile and posts
router.delete('/', verifyToken, async (req, res) => {
  try {
    const user = req.body.user.id;

    //TODO: delete user posts
    await Profile.findOneAndRemove({ user });
    await User.findOneAndRemove({ _id: user });

    res.send({ message: 'User was deleted successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server error.' });
  }
});

module.exports = router;
