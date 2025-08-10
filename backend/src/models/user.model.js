const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  created_at: { type: Date, default: Date.now }
}, { collection: 'wellness_accounts' });

module.exports = mongoose.model('User', userSchema);
