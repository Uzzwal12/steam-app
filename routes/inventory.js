const express = require("express");
const { User } = require("../models/user");
const { syncInventory } = require("../controller/inventory");
const router = express.Router();

router.get("/", (req, res) => {});

module.exports = router;
