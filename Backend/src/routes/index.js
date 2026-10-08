const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
// const usersRoutes = require('../modules/users/users.routes');
const router = express.Router();

router.get('/health', (req, res) => {
  return res.ok(null, 'ok');
});

router.get('/ready', (req, res) => {
  return res.ok(null, 'ready');
});

router.use('/auth', authRoutes);
// router.use('/users', usersRoutes); one route for reference


module.exports = router;
