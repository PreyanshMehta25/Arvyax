const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');

// ... (register and login functions are correct)

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const password_hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password_hash });

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    // Check if email credentials are even present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('FATAL: EMAIL_USER or EMAIL_PASS not configured in .env file.');
      // Don't expose this detail to the client
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      to: user.email,
      from: `Arvyax Wellness <${process.env.EMAIL_USER}>`,
      subject: 'Your Password Reset Link',
      text: `Please click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'A password reset link has been sent to your email.' });
  } catch (error) {
    // ✅ **IMPROVED LOGGING**: This will show the exact reason Nodemailer is failing.
    console.error('FORGOT PASSWORD ERROR:', error);
    res.status(500).json({ message: 'Error sending password reset email.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    user.password_hash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset.' });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};