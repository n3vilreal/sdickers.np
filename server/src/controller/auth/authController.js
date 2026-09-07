const User = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../../services/sendEmail");

const toUserPayload = (u) => ({
  _id: u.id,
  id: u.id,
  userEmail: u.user_email,
  userPhoneNumber: u.user_phone_number,
  userName: u.user_name,
  userPassword: u.user_password,
  role: u.role,
});

exports.registerUser = async (req, res) => {
  try {
    const { email, password, phoneNumber, username } = req.body;
    if (!email || !phoneNumber || !password || !username) {
      return res.status(400).json({ message: "Please provide every details." });
    }
    const userFound = await User.findByEmail(email);
    if (userFound.length > 0) {
      return res.status(400).json({ message: "User already exists with that email." });
    }
    await User.create({
      user_name: username,
      user_phone_number: phoneNumber,
      user_email: email,
      user_password: bcrypt.hashSync(password, 10),
      role: "customer",
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all details" });
    }
    const userFound = await User.findByEmail(email);
    if (userFound.length === 0) {
      return res.status(404).json({ message: "Invalid credentials." });
    }
    const isMatched = bcrypt.compareSync(password, userFound[0].user_password);
    if (isMatched) {
      const token = jwt.sign({ id: userFound[0].id }, process.env.SECRET_KEY);
      const u = userFound[0];
      res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
          id: u.id,
          _id: u.id,
          userName: u.user_name,
          userEmail: u.user_email,
          userPhoneNumber: u.user_phone_number,
          role: u.role,
        },
      });
    } else {
      res.status(404).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide email" });
    }
    const userExist = await User.findByEmail(email);
    if (userExist.length === 0) {
      return res.status(404).json({ message: "Email is not registered" });
    }
    const otp = Math.floor(Math.random() * 10000);
    await User.update(userExist[0].id, { otp: String(otp), is_otp_verified: false });
    await sendEmail({
      email,
      subject: "Your OTP for Sdickers",
      message: `Your OTP for Sdickers is ${otp}`,
    });
    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Could not send OTP email: " + error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide both email and otp" });
    }
    const userExists = await User.findByEmail(email);
    if (userExists.length === 0) {
      return res.status(404).json({ message: "Email isnot registered" });
    }
    if (String(userExists[0].otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid otp" });
    }
    await User.update(userExists[0].id, { otp: null, is_otp_verified: true });
    res.status(200).json({ message: "Otp is correct" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Please fill the fields" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords didnot match" });
    }
    const userExists = await User.findByEmail(email);
    if (userExists.length === 0) {
      return res.status(404).json({ message: "User isnot registered" });
    }
    if (userExists[0].is_otp_verified !== true) {
      return res.status(403).json({ message: "You cannot perform this action" });
    }
    await User.update(userExists[0].id, {
      user_password: bcrypt.hashSync(newPassword, 10),
      is_otp_verified: false,
    });
    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};