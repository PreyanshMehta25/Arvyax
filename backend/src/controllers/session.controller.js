const Session = require('../models/session.model');


exports.getPublicSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'name email');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.id });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!session) return res.status(404).json({ message: 'Not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    // The file has been uploaded to Cloudinary by the multer middleware.
    // The URL is available in req.file.path
    res.status(200).json({ imageUrl: req.file.path });
  } catch (error) {
    console.error('Image Upload Error:', error);
    res.status(500).json({ message: 'Image upload failed.' });
  }
};

// UPDATE saveDraft and publishSession
exports.saveDraft = async (req, res) => {
  const { _id, title, tags, json_file_url, coverImageUrl } = req.body; // Add coverImageUrl
  const update = {
    title,
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
    json_file_url,
    coverImageUrl, // Add coverImageUrl
    status: 'draft',
    updated_at: new Date()
  };

  try {
    let session;
    if (_id) {
      session = await Session.findOneAndUpdate(
        { _id: _id, user_id: req.user.id },
        update,
        { new: true, upsert: false }
      );
    } else {
      session = await Session.create({ ...update, user_id: req.user.id });
    }
    if (!session) return res.status(404).json({ message: 'Session not found or permission denied.' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Save draft failed' });
  }
};

exports.publishSession = async (req, res) => {
  const { _id, title, tags, json_file_url, coverImageUrl } = req.body; // Add coverImageUrl
  const updateData = {
    title,
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
    json_file_url,
    coverImageUrl, // Add coverImageUrl
    status: 'published',
    updated_at: new Date()
  };

  try {
    let session;
    if (_id) {
      session = await Session.findOneAndUpdate(
        { _id: _id, user_id: req.user.id },
        updateData,
        { new: true }
      );
    } else {
      session = await Session.create({ ...updateData, user_id: req.user.id });
    }
    if (!session) return res.status(404).json({ message: 'Session not found or permission denied.' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Publish failed' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findOneAndDelete({ _id: id, user_id: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found or permission denied.' });
    res.status(200).json({ message: 'Session deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete session.' });
  }
};

exports.toggleLiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ _id: id, user_id: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found or permission denied.' });

    session.isLive = !session.isLive;
    await session.save();
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update live status.' });
  }
};

exports.incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;
    await Session.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    res.status(200).json({ message: 'View count updated.' });
  } catch (err) {
    res.status(200).json({ message: 'View count update failed but request was processed.' });
  }
};