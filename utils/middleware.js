const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if(error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: error.message
        })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    next(error)
}

const tokenExtractor = (error, request, response, next) => {
    logger.info('--- tokenExtractor ---')
    logger.info('-------------')
    logger.info('Finding authorization...')
    logger.info(authorization)
    logger.info('-------------')
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

const userExtractor = async  (error, request, response, next) => {
    logger.info('--- userExtractor ---')

    const token = request.token
    logger.info('-------------')
    logger.info('Token: ', token)
    logger.info('-------------')

    if(!token){
        logger.info('Token missing')
        return response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken.id){
        logger.error('Token invalid')
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
        logger.error('User not found')
        return response.status(404).json({ error: 'user not found' })
    }

    request.user = user
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}