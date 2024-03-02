const supertest = require('supertest')
const helper = require('../utils/list_helper')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id property is defined', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('creation of a blog succesfull', async () => {
    const newBlog = {
        title: 'Curriculum in a Page',
        author: 'Federico Peirano',
        url: 'https://federicopeirano.netlify.app',
        likes: 10,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain(
        'Curriculum in a Page'
    )
})

test('blog without likes is not added', async () => {
    const newBlog = {
        title: 'Curriculum in a Page',
        author: 'Federico Peirano',
        url: 'https://federicopeirano.netlify.app',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog without url or title is not added', async () => {
    const newBlog = {
        author: 'Federico Peirano',
        url: 'https://federicopeirano.netlify.app',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test.only('updating an existing blog object', async () => {
    const newBlog = {
        title: 'Curriculum in a Page',
        author: 'Federico Peirano',
        url: 'https://federicopeirano.netlify.app',
        likes: 10,
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogId = response.body.id

    const updatedBlog = {
        title: 'Updated Title',
        author: 'Updated Author',
        url: 'https://updatedurl.com',
        likes: 20,
    }

    await api
        .put(`/api/blogs/${blogId}`)
        .send(updatedBlog)
        .expect(200)

    const updatedResponse = await api.get(`/api/blogs/${blogId}`)
    expect(updatedResponse.body).toEqual(expect.objectContaining(updatedBlog))
})
