const CustomAPIError = require('../errors/custom-api')
const { Unauthorized } = require('../errors/index')
require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Unauthorized('No token provided')
    }
    const token = authHeader.split(' ')[1]

    try {
        // VERIFY THAT THE TOKEN IS OURS
        const decoded = jwt.verify(token, secret)

        // you could see this in some code base
        // const user = User.findById(decoded.userId).select('-password')
        // req.user = user

        req.user = { userId: decoded.userId, name: decoded.name }
    } catch (error) {
        throw new Unauthorized('Not allowed to access this route')
    }

    next()
}

module.exports = authMiddleware