const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    console.log('GET /api/blogs endpoint hit')
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

blogRouter.get('/:id', async (request, response) => {
    console.log('GET /api/blogs endpoint hit')
    const blog = await Blog.findById(request.params.id)
    if(blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogRouter.post('/', async (request, response) => {
    console.log('POST /api/blogs endpoint hit')
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    if(blog.title === undefined){
        response.status(400).end()
    }

    if(blog.url === undefined){
        response.status(400).end()
    }

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    console.log('DELETE /api/blogs endpoint hit')
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

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