const express = require('express');
const router = express.Router();
const { createTask, updateTask, getDashboardStats, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/stats', getDashboardStats);

module.exports = router;
