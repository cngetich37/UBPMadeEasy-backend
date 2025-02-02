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

// Second email account
const transporter2 = nodemailer.createTransport({
  service: "gmail",
  host: `smtp.gmail.com`,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER_TWO,
    pass: process.env.EMAIL_SECRET_TWO,
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
  const resetPasswordLink = `https://ubpadmace.cnetechafrica.org/reset-password/${token}`;

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
    // console.log("Email sent: " + info.response);
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

// Contact form submission handler
const sendEmail = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Validate the request body
  if (!name || !email || !message) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Set up mail options for sending the contact form email
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email address
    to: email, // Sender's email address (the one provided in the form)
    subject: `UBPACE – Thank You for Your Feedback`, // Subject of the email
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for contacting UBPACE. We truly appreciate hearing from you.</p>
      <p>We have received your message and are currently reviewing it. We will be in touch shortly with a response.</p>
      <p>In the meantime, feel free to reach out if you have any additional questions or need further assistance</p>
      <p><strong>Here is your message:</strong> ${message}</p>
      <p>Sincerely,<br />UBPACE Team</p>
    `, // HTML content of the email
  };

  // Send the email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email!" });
    }
    // console.log("Email sent: " + info.response);
    res.status(200).json({ message: "Message sent successfully!" });
  });
});

// Contact form submission handler
const sendEmailCnetech = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Validate the request body
  if (!name || !email || !message) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Set up mail options for sending the contact form email
  const mailOptions = {
    from: process.env.EMAIL_USER_TWO, // Your email address
    to: email, // Sender's email address (the one provided in the form)
    subject: `CNETECH AFRICA – Think and Create it`, // Subject of the email
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for contacting CNETECH AFRICA. We truly appreciate hearing from you.</p>
      <p>We have received your message and are currently reviewing it. We will be in touch shortly with a response.</p>
      <p>In the meantime, feel free to reach out if you have any additional questions or need further assistance</p>
      
      <p>Sincerely,<br />CNETECH AFRICA</p>

      <table style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333;">
      <tr>
      <td>
      <strong style="color:#000D2F">CNETECH AFRICA</strong><br>
      <em style="color:#000D2F">Think & Create it</em><br><br>
      📍 <strong style="color:#000D2F">Non-profit Organization dedicated to bridging the digital divide.</strong><br>
      📧 <strong style="color:#000D2F">Email:</strong> <a href="mailto:contact@cnetechafrica.org" style="color: #0078D4; text-decoration: none;">contact@cnetechafrica.org</a><br>
      📱 <strong style="color:#000D2F">Phone:</strong> +254 703432805<br>
      🌐 <strong style="color:#000D2F">Website:</strong> <a href="https://www.cnetechafrica.org" style="color: #0078D4; text-decoration: none;">www.cnetechafrica.org</a><br>
      🔗 <strong style="color:#000D2F">LinkedIn:</strong> <a href="https://www.linkedin.com/company/cnetech-africa/" style="color: #0078D4; text-decoration: none;">linkedin.com/in/cnetechafrica</a><br><br>
      </td>
      </tr>
      <tr>
      <td>
      <img src="https://www.cnetechafrica.org/cnetechafricalogo.jpeg" alt="CNETECH AFRICA Logo" style="width: 150px; margin-top: 10px;">
      </td>
      </tr>
      <tr>
      <td>
      <em style="color:#000D2F">"Empowering innovation, driving Africa’s digital future."</em><br><br>
      <strong style="color:#000D2F">Follow us:</strong><br>
      🌍 <a href="http://facebook.com/cnetechafrica" style="color: #0078D4; text-decoration: none;">Facebook</a> |
      🐦 <a href="http://twitter.com/cnetechafrica" style="color: #0078D4; text-decoration: none;">Twitter</a> |
      📸 <a href="http://instagram.com/cnetech_africa" style="color: #0078D4; text-decoration: none;">Instagram</a>
      </td>
      </tr>
      </table>`, // HTML content of the email
  };

  // Send the email using Nodemailer
  transporter2.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email!" });
    }
    // console.log("Email sent: " + info.response);
    res.status(200).json({ message: "Message sent successfully!" });
  });
});
module.exports = {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
  sendEmail,
  sendEmailCnetech
};
