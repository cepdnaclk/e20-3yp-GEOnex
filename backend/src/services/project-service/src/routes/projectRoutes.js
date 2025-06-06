const express = require('express');
const dotenv = require('dotenv');
const {createProject, getProjects, getProjectById, updateProject, deleteProject} = require('../controllers/projectController');
const router = express.Router();

router.post('/', createProject);
router.get('/recentprojects/:userid', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
