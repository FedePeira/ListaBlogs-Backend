const logger = require('../utils/logger')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    logger.info('GET /api/users endpoint hit')
    const users = await User
        .find({}).populate('blogs')

    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    logger.info('POST /api/users endpoint hit')

    const { username, name, password } = request.body
    logger.info('Request body: ' + request.body)

    if (password.length < 3) {
        return response.status(400).json({ error: 'password too short' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hashSync(password, saltRounds)
    logger.info('Password sin hash: ' + password)
    logger.info('Password hasheada: ' + passwordHash)

    const user = new User({
        username: username,
        name: name,
        password: passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter