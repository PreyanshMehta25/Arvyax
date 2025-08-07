const mongoose = require('mongoose');
require('./user.model');

const sessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  tags: [String],
  json_file_url: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  isLive: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'wellness_sessions' });

module.exports = mongoose.model('Session', sessionSchema);