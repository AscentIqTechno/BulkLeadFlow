const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EmailDirectorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = model("EmailDirectory", EmailDirectorySchema);
