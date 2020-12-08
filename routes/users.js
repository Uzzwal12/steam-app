const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.find({
    email: req.body.email,
    username: req.body.username,
  });
  if (user) return res.status(400).send("User alredy exists");

  user = new User(req.body, [
    "name",
    "username",
    "email",
    "password",
    "steamId",
  ]);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ["id", "name", "username", "email"]));
});

module.exports = router;
