const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

// @desc Post Contact Us email
// @route GET /api/contact/send-email
// @access public
const contactUs = asyncHandler((req, res) => {
  const { name, email, message } = req.body;

  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_SECRET,
    },
  });

  const mailOptions = {
    from: email,
    to: "ubpmadeeasy@gmail.com",
    subject: "New Message from UBPMadeEasy Web Portal",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully");
    }
  });
});

module.exports = { contactUs };
