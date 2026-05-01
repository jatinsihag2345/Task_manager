const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectDetails, addMember } = require('../controllers/projectController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectDetails);
router.post('/:id/members', addMember);

module.exports = router;
