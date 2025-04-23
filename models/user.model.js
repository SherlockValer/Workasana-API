const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

// User Schema (name, email, photo, password, passwordConfirm)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us you name!"],
  }, // User's name
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  }, // Email must be unique
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, // Automatically never shows in any output response (res.json, etc)
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!
      validator: function (el) {
        return el === this.password; // abc === abc (returns true)
      },
      message: "Passwords are not the same!",
    },
  },
});

// Pre-save middleware
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Set current password to encrypted version of original password
  this.password = await bcrypt.hash(this.password, 12); // Best to use 12 rounds than 10.

  // Delete passwordConfirm (Only needed for validation)
  this.passwordConfirm = undefined;

  next();
});

// A function to compare password on login
// This method will be available on all the user documents created using this model
// Call this function in authControllers
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); // returns true or false
};

const User = mongoose.model("User", userSchema);

module.exports = User;
