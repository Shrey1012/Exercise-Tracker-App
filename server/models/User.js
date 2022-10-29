const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    password: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: "male" || "female", required: true },
    phone: { type: Number, required: true },
    email: { type: String, unique: true, lowercase: true, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
