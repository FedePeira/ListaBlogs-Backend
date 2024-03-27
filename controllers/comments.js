const logger = require('../utils/logger')
const commentRouter = require('express').Router()
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')

const getTokenFrom = request => {
    logger.info(request.get('authorization'))
    const authorization = request.get('authorization')
    logger.info('-------------')
    logger.info('Finding authorization...')
    logger.info(authorization)
    logger.info('-------------')
    logger.info(authorization && authorization.startsWith('Bearer '))
    if (authorization && authorization.startsWith('Bearer ')) {
        logger.info(authorization.replace('Bearer ', ''))
        return authorization.replace('Bearer ', '')
    }
    return null
}

commentRouter.get('/', async (request, response) => {
    logger.info('GET /api/comments endpoint hit')
    const comments = await Comment.find({}).populate('blog').populate('user')
    console.log(comments)

    response.json(comments)
})

commentRouter.post('/', async (request, response) => {
    logger.info('----------------------------')
    logger.info('POST /api/comment endpoint hit')
    const body = request.body
    console.log(request.params)
    logger.info('-------------------')
    logger.info('Request body: ', body)
    logger.info('Blog id: ', body.id)
    logger.info('-------------------')

    if(body.content === undefined) {
        response.status(400).end()
    }

    logger.info('Comment: ', body.content)
    logger.info('-------------------')

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    logger.info('---------------------')
    logger.info('Token: ', decodedToken)
    logger.info('---------------------')
    if(!decodedToken){
        logger.info('Token missing')
        return response.status(401).json({ error: 'token missing' })
    }

    if(!decodedToken.id){
        logger.error('Token invalid')
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    logger.info('---------------------')
    logger.info('User: ', user)
    logger.info('---------------------')
    if (!user) {
        logger.error('User not found')
        return response.status(404).json({ error: 'user not found' })
    }

    const comment = new Comment({
        content: body.content,
        blog: body.id,
        user: user.id,
    })

    const savedComment = await comment.save()
    logger.info('---------------------')
    logger.info('Comment: ', comment)
    console.log(savedComment._id)
    logger.info('---------------------')

    const blog = await Blog.findById(body.id)
    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }
    blog.comments = blog.comments.concat(savedComment._id)

    const updatedBlog = await blog.save()
    logger.info('---------------------')
    logger.info('Updated Blog: ', updatedBlog)
    logger.info('---------------------')

    logger.info('Creation successfull: ', savedComment)
    response.status(201).json(savedComment)
})

module.exports = commentRouter