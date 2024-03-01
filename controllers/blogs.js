const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    console.log('GET /api/blogs endpoint hit')
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

blogRouter.post('/', (request, response) => {
    console.log('POST /api/blogs endpoint hit')
    const blog = new Blog(request.body)

    blog
        .save()
        .then(savedBlog => {
            response.status(201).json(savedBlog)
        })
})

module.exports = blogRouter