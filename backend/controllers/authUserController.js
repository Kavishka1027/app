const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');


//request new recover password
const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'Email not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const html = `
      <h3>Password Reset Request</h3>
      <p>Hello <strong>${user.firstname}</strong>,</p>
      <p>NIC Number: <strong>${user.AId}</strong></p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `;

    await sendEmail(user.email, 'Password Reset Link - Wet Snout Pet Caring Company', html);
    res.status(200).json({ message: 'Reset email sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.recoverPassword = recoverPassword;
exports.resetPassword = resetPassword;