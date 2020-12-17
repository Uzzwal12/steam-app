const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // let user = await User.find().or([
  //   { username: req.body.username },
  //   { email: req.body.email },
  // ]);

  let user = await User.findOne({ username: req.body.username });

  let email = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("User alredy exists");

  user = new User(
    _.pick(req.body, ["name", "username", "email", "password", "steamId"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ["id", "name", "username", "email"]));
});

module.exports = router;
