const express = require("express");
const { User } = require("../models/user");
const { syncInventory } = require("../controller/inventory");
const router = express.Router();

router.get("/", async (req, res) => {
  let queryValues = req.query.id;
  let data = await syncInventory(queryValues);
  res.send(data);
});

module.exports = router;
