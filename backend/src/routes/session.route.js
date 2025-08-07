// backend/src/routes/session.route.js

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  getPublicSessions,
  getUserSessions,
  getSessionById,
  saveDraft,
  publishSession,
  deleteSession,
  toggleLiveStatus,
  incrementViewCount
} = require('../controllers/session.controller');

// Public routes (no auth needed)
router.get('/sessions', getPublicSessions);
// ✅ **THE FIX IS HERE**: This route must match exactly what the frontend is calling.
router.post('/sessions/:id/view', incrementViewCount);

// Protected routes (auth needed)
router.get('/my-sessions', auth, getUserSessions);
router.get('/my-sessions/:id', auth, getSessionById);
router.post('/my-sessions/save-draft', auth, saveDraft);
router.post('/my-sessions/publish', auth, publishSession);
router.delete('/my-sessions/:id', auth, deleteSession);
router.patch('/my-sessions/:id/live', auth, toggleLiveStatus);

module.exports = router;