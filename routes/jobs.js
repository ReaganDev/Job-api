const express = require('express')
const router = express.Router()
const { createJob, singleJob, deleteJob, updateJob, getJobs } = require('../controllers/jobs')


router.route('/:id').get(singleJob).patch(updateJob).delete(deleteJob)
router.route('').post(createJob).get(getJobs)

module.exports = router