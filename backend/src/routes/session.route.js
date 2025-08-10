// backend/src/routes/session.route.js

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const upload = require('../config/cloudinary');
const {
  getPublicSessions,
  getUserSessions,
  getSessionById,
  saveDraft,
  publishSession,
  deleteSession,
  toggleLiveStatus,
  incrementViewCount,
  uploadImage 
} = require('../controllers/session.controller');

router.get('/sessions', getPublicSessions);
router.post('/sessions/:id/view', incrementViewCount);

router.get('/my-sessions', auth, getUserSessions);
router.get('/my-sessions/:id', auth, getSessionById);
router.post('/my-sessions/save-draft', auth, saveDraft);
router.post('/my-sessions/publish', auth, publishSession);
router.delete('/my-sessions/:id', auth, deleteSession);
router.patch('/my-sessions/:id/live', auth, toggleLiveStatus);
router.post('/upload-image', auth, upload.single('image'), uploadImage);

module.exports = router;