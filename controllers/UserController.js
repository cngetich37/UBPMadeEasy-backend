const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/UserModel");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: `smtp.gmail.com`,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_SECRET,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// @desc Register a user
// @route POST /api/users/signup
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists!");
  }
  const hashPassword = await bcrypt.hash(confirmPassword, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    confirmPassword: hashPassword,
  });
  if (user) {
    res.status(201).json({ message: "Account created successfully!" });
  } else {
    res.status(400);
    throw new Error("Invalid user details");
  }
  const userPassword = req.body.password;
  const userFirstName = req.body.firstName;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to UBP Made Easy.",
    html: `Dear ${userFirstName},

    Welcome to UBP MADE EASY Admin Portal.
    
    Your account has been successfully created, marking the beginning of a seamless and rewarding experience.Your password is: <b>${userPassword}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email!" });
    }
    console.log("Email sent: " + info.response);
  });
});

// @desc Login a user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  // compare password with hashedPassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Current user
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc Forgot Password
// @route POST /api/users/forgot-password
//@access public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required!");
  }
  // Check if the email exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  // Generate JWT token for password reset
  const token = jwt.sign(
    {
      user: {
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  // Create a password reset link with the token
  const resetPasswordLink = `https://ubpmeadmin.netlify.app/reset-password/${token}`;

  // Send email with the password reset link
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "UBP Made Easy Password Reset",
    html: `Click the following link to reset your password: <a href="${resetPasswordLink}">${resetPasswordLink}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email!" });
    }
    console.log("Email sent: " + info.response);
    res.status(200).json({ message: "Password reset email sent successfully" });
  });
});

// @desc Reset Password
// @route POST /api/users/reset-password/:token
//@access public

const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const newPassword = req.body.password;
  if (!token) {
    res.status(401);
    throw new Error("invalid token or token is missing!");
  }
  // Verify the token and retrieve the user's email or user ID from the database
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("User is not authorized");
    }
    if (!decoded || !decoded.user || !decoded.user.id) {
      res.status(401);
      throw new Error("Invalid token format. User ID not found.");
    }
    req.user = decoded.user;
  });
  if (!newPassword) {
    res.status(400);
    throw new Error("Please provide the password!");
  }

  // Update the user's password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { password: hashedPassword },
    { new: true }
  );
  res.status(200).json({ message: "Password reset successful" });
});
module.exports = {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
};
