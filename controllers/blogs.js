const logger = require('../utils/logger')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    logger.info('GET /api/blogs endpoint hit')
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    logger.info('GET /api/blogs endpoint hit')
    const blog = await Blog.findById(request.params.id)
    if(blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogRouter.post('/', async (request, response) => {
    logger.info('POST /api/blogs endpoint hit')
    const body = request.body
    console.log('Request body: ' + body)
    const user = request.user
    console.log('Token user: ' + user)
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

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    console.log('DELETE /api/blogs endpoint hit')

    const user = request.user
    logger.info('Token user: ' + user)

    const blog = await Blog.findById(request.params.id)
    logger.info('Body blog: ' + blog)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if(user.id.toString() !== blog.user.toString()) {
        return response.status(401).json({ error: 'unauthorized' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

/* No esta Actualizado */
blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).end()
})

module.exports = blogRouter