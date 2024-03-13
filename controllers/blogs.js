const logger = require('../utils/logger')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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

blogRouter.get('/', async (request, response) => {
    logger.info('GET /api/blogs endpoint hit')
    const blogs = await Blog.find({}).populate('user')
    logger.info('Getting data successfull')
    response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    logger.info('GET /api/blogs/:id endpoint hit')
    const blog = await Blog.findById(request.params.id)
    if(blog) {
        logger.info(`Getting ${request.params.id} successfull`)
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogRouter.post('/', async (request, response) => {
    logger.info('---------------------')
    logger.info('POST /api/blogs endpoint hit')
    const body = request.body

    logger.info('---------------------')
    logger.info('Request body: ', body)
    logger.info('---------------------')

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
    if (!user) {
        logger.error('User not found')
        return response.status(404).json({ error: 'user not found' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })

    if(blog.title === undefined){
        response.status(400).end()
    }

    if(blog.url === undefined){
        response.status(400).end()
    }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    logger.info('Creation successfull: ', savedBlog)
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    logger.info('---------------------')
    logger.info('DELETE /api/blogs endpoint hit')

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    logger.info('---------------------')
    logger.info('Token: ', decodedToken)
    logger.info('---------------------')
    if(decodedToken === undefined){
        logger.error('Token missing')
        return response.status(401).json({ error: 'token missing' })
    }

    if(!decodedToken.id){
        logger.error('Token invalid')
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
        logger.error('User not found')
        return response.status(404).json({ error: 'user not found' })
    }

    const blog = await Blog.findById(request.params.id)
    logger.info('Body blog: ', blog)
    logger.info('--------------------')

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if(user.id.toString() !== blog.user.toString()) {
        return response.status(401).json({ error: 'unauthorized' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    logger.info('Delete successfull')
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    console.log('PUT /api/blogs/:id endpoint hit')
    const body = request.body

    console.log('-------------------------------')
    console.log('Request body: ', body)
    console.log('-------------------------------')

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    logger.info('Update successfull: ', blog)
    response.status(200).end()
})

module.exports = blogRouter