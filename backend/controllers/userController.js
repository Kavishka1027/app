const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

//get all users
const getAllUsers = async (req, res, next) => {
  let Users;
  try {
    Users = await User.find();
  } catch (err) {
    console.log("Error fetching users!", err);
  }
  if (!Users) {
    return res.status(404).json({ message: "No users found" });
  }
  return res.status(200).json({ Users });
};

//get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 4 });

    if (!customers.length) {
      return res.status(200).json({ message: "No customers found" });
    }

    return res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//get all veterinarians
const getAllVeterinarians = async (req, res) => {
  try {
    const veterinarians = await User.find({ role: 3 });

    if (!veterinarians.length) {
      return res.status(200).json({ message: "No veterinarians found" });
    }

    return res.status(200).json({ veterinarians });
  } catch (error) {
    console.error("Error fetching veterinarians:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//get user by id
const getUserById = async (req, res, next) => {
  const id = req.params.id; // Assuming you're passing the user ID in the URL

  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log("Error fetching user:", err);
  }
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  return res.status(200).json({ user });
};

//add user
const addUser = async (req, res) => {
  try {
    const {
      AId,
      firstname,
      lastname,
      gender,
      address,
      dob,
      email,
      phone,
      image,
      password,
      role,
      AdminID,
      ManagerID,
      VeterinarianID,
      CustomerID,
      rewards,
    } = req.body;

    if (
      !AId ||
      !firstname ||
      !lastname ||
      !gender ||
      !address ||
      !dob ||
      !email ||
      !phone ||
      !password ||
      !role
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prepare user data
    const newUser = new User({
      AId,
      firstname,
      lastname,
      gender,
      address,
      dob,
      email,
      phone,
      image,
      password,
      role,
      AdminID,
      ManagerID,
      VeterinarianID,
      CustomerID,
      rewards: role === 4 ? (rewards !== undefined ? rewards : 0) : undefined,
    });

    // Save to DB
    await newUser.save();

    res.status(201).json({
      message: "User added successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in addUser:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

//update user
const updateUser = async (req, res, next) => {
  const {
    firstname,
    lastname,
    gender,
    address,
    dob,
    email,
    phone,
    image,
    password,
    currentPassword,
  } = req.body;
  const updates = req.params.id;

  if (password) {
    const user = await User.findById(updates);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!currentPassword)
      return res.status(400).json({ message: "Current password required" });
    if (currentPassword !== user.password)
      return res.status(401).json({ message: "Incorrect current password" });
  }

  if (email || phone) {
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase().trim() }] : []),
        ...(phone ? [{ phone }] : []),
      ],
      _id: { $ne: updates },
    });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email?.toLowerCase()?.trim()
            ? "Email already exists"
            : "Phone number already exists",
      });
    }
  }

  let users;
  try {
    users = await User.findByIdAndUpdate(updates, {
      firstname: firstname,
      lastname: lastname,
      gender: gender,
      address: address,
      dob: dob,
      email: email,
      phone: phone,
      image: image,
      password: password,
    });
    users = await users.save();
  } catch (err) {
    console.log("Error updating user!", err);
  }

  if (!users) {
    return res.status(500).json({ message: "Unable to update user" });
  }
  return res.status(200).json({ users });
};

// User Login with Session
const loginUser = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { AdminID: userId },
        { ManagerID: userId },
        { VeterinarianID: userId },
        { CustomerID: userId },
      ],
    });

    if (!user) {
      return res.status(404).json({ err: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ err: "Incorrect password" });
    }

    // Store user info in session
    req.session.user = {
      id: user._id,
      role: user.role,
      userId: userId,
    };
    console.log("User credentials saved in session:", req.session.user);

    // Role-based redirection URL
    let dashboardURL = "/dashboard";
    switch (user.role) {
      case 1:
        dashboardURL = "/adminDash";
        break;
      case 2:
        dashboardURL = "/managerDash";
        break;
      case 3:
        dashboardURL = "/veterinarianDash";
        break;
      case 4:
        dashboardURL = "/customerDash";
        break;
    }

    return res.json({
      status: "ok",
      message: "Login successful",
      role: user.role,
      redirect: dashboardURL,
      user: req.session.user, // Sending session data to the frontend
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ err: "Server error" });
  }
};


// Get Logged-in User Profile
const getLoggedInUser = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = req.session.user.id;

  try {
    const user = await User.findById(userId).select('-password'); // Hide password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// User Logout with Session Destruction
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ err: "Server error during logout" });
    }

    // Optionally clear the session cookie on the client
    res.clearCookie("connect.sid"); // default session cookie name

    return res.json({ status: "ok", message: "Logout successful" });
  });
};

// Send forgot password link
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No user found with that email" });

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    await sendEmail(
      user.email,
      "Password Reset",
      `Click here to reset your password: ${resetUrl}`
    );

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Reset password using token
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//delete user
const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  let user;
  try {
    user = await User.findOneAndDelete(id);
  } catch (err) {
    console.error("Error deleting user!", err);
    return res
      .status(500)
      .json({ message: "Server error while deleting user" });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  return res.status(200).json({ message: "User deleted successfully" });
};

exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getAllCustomers = getAllCustomers;
exports.getAllVeterinarians = getAllVeterinarians;
exports.addUser = addUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.getLoggedInUser = getLoggedInUser;


