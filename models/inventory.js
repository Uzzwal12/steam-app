const mongoose = require("mongoose");
const Joi = require("joi");

const inventorySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    steamId: {
      type: String,
      required: true,
    },

    items: {
      type: [Object],
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

function validateInventory(req) {
  const schema = {
    username: Joi.string().required(),
    steamId: Joi.string().required(),
    items: Joi.object(),
  };

  return Joi.validate(req, schema);
}

exports.Inventory = Inventory;
exports.validate = validateInventory;
