const mongoose = require("mongoose");
const Joi = require("joi");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },

    username: {
      type: String,
      unique: true,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      min: 5,
    },

    steamId: {
      type: String,
      required: true,
    },
  })
);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(5).required(),
    steamId: Joi.string().required(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
