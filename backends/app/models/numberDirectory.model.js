// models/NumberDirectory.model.js

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const NumberDirectorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    number: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = model("NumberDirectory", NumberDirectorySchema);
