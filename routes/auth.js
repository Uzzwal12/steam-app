const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid username or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  res.send("Login successful");
});

function validate(req) {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().min(5).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
