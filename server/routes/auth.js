const express = require('express');
const router = express.Router();
const { signup, login, getMe, googleLogin } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', auth, getMe);

module.exports = router;
