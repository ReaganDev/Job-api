const { StatusCodes } = require('http-status-codes')
const Job = require('../models/Job')
const { BadRequest, NotFoundError, BadRequestError } = require('../errors')

const createJob = async (req, res) => {
    req.body.createdById = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json(job)
}


const getJobs = async (req, res) => {
    const jobs = await Job.find({ createdById: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json(jobs)
}


const singleJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    //const { id: jobId } = req.params
    const job = await Job.findOne({ createdById: userId, _id: jobId })
    if (!job) {
        throw new NotFoundError('Job does not exist')
    }
    res.status(StatusCodes.OK).json(job)
}


const updateJob = async (req, res) => {
    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req

    if (!company || !position) {
        throw new BadRequestError('Company and position fields are required')
    }

    const job = await Job.findOneAndUpdate({ createdById: userId, _id: jobId }, req.body, { new: true, runValidators: true })
    console.log(job)
    if (!job) {
        throw new NotFoundError('Job does not exist')
    }
    res.status(200).json({ job })
}


const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    const job = await Job.findOneAndDelete({ createdById: userId, _id: jobId })
    if (!job) {
        throw new NotFoundError('Job does not exist')
    }
    res.status(StatusCodes.OK).json({ msg: 'Job deleted' })
}


module.exports = { createJob, singleJob, deleteJob, updateJob, getJobs }