const express = require('express');
const dotenv = require('dotenv');
const {createProject, getProjects, getProjectById, updateProject, deleteProject, modifySectionToProject, deleteSectionfromProject, modifyBaseMode, modifyBaseLocation, updateProjectStatus} = require('../controllers/projectController');
const router = express.Router();

router.post('/', createProject);
router.get('/recentprojects/:userid', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);

router.put('/status/:id', updateProjectStatus);
router.put('/sections/:id', modifySectionToProject);

router.delete('/:id', deleteProject);
router.delete('/sections/:id', deleteSectionfromProject);

router.put('/basemode/:id',modifyBaseMode);
router.put('/baselocation/:id',modifyBaseLocation);

module.exports = router;
