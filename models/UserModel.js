const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide the first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide the last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide the email address"],
      unique: [true, "Email address already exists!"],
    },
    password: {
      type: String,
      required: [true, "Please provide the password"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Please provide the confirm password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
