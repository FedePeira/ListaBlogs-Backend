const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

loginRouter.post('/', async (request, response) => {
    logger.info('POST /api/login log in')
    const { username, password } = request.body
    logger.info('-------------------')
    logger.info('Request body: ', request.body)
    logger.info('-------------------')

    const user = await User.findOne({ username: username })
    logger.info('User: ', user)
    logger.info('-------------------')

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)
    logger.info(passwordCorrect)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET)

    console.log('-----------------')
    console.log('Token: ', token)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter