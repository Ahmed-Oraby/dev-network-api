const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  company: String,
  website: String,
  githubUserName: String,
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      specialization: {
        type: String,
        required: true,
      },
      grade: String,
      degree: String,
      from: {
        type: Date,
        required: true,
      },
      to: Date,
      description: String,
      current: Boolean,
    },
  ],
  experience: [
    {
      company: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: Date,
      description: String,
      current: Boolean,
    },
  ],
  social: {
    youtube: String,
    twitter: String,
    linkedin: String,
    github: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
