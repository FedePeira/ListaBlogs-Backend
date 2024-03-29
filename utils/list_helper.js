const logger = require('./logger')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const dummy = (blogs) => {
    if(blogs.length === 0) {
        logger.info('Theres no blogs')
        return 1
    } else {
        logger.info('Theres many blogs')
        return 1
    }
}

const countBlogLikes = (blogs) => {
    if(blogs.length === 0) {
        logger.info('The list of blogs is empty')
        return 0
    } else {
        logger.info(`Theres ${blogs.length} blogs`)
        return 1
    }
}

const countBlogsLikes = (blogs) => {
    let likes = 0
    blogs.forEach(blog => {
        likes += blog.likes
    })
    logger.info(`Theres a total of ${likes} likes`)
    return likes
}

const getFavoriteBlog = (blogs) => {
    let mostLikes = 0
    let favoriteBlog = null
    blogs.forEach(blog => {
        if(blog.likes > mostLikes) {
            favoriteBlog = blog
            mostLikes = blog.likes
        }
    })
    logger.info(`The favorite blog is ${favoriteBlog} with ${mostLikes} `)
    return favoriteBlog
}

class Blogger {
    constructor(author, number) {
        this.author = author
        this.number = number
    }
}

const mostBlogs = (blogs) => {
    let mostBlogs = 0
    let favoriteAuthor = ''
    let bloggers = []

    function isInList(getBlog) {
        return bloggers.find(blog => blog.author === getBlog.author) !== undefined
    }

    blogs.forEach(getBlog => {
        if(isInList(getBlog)){
            const blogger = bloggers.find(blog => blog.author === getBlog.author)
            blogger.number++
        } else {
            const blogger = new Blogger(getBlog.author, 1)
            bloggers.push(blogger)
        }
    })

    bloggers.forEach(blogger => {
        if(blogger.number > mostBlogs){
            favoriteAuthor = blogger.author
            mostBlogs = blogger.number
        }
    })

    logger.info(`The most blogger is ${favoriteAuthor} with ${mostBlogs} `)

    return {
        author: favoriteAuthor,
        blogs: mostBlogs
    }
}

const mostLikes = (blogs) => {
    let mostLikes = 0
    let favoriteAuthor = ''
    let bloggers = []

    function isInList(getBlog) {
        return bloggers.find(blog => blog.author === getBlog.author) !== undefined
    }

    blogs.forEach(getBlog => {
        if(isInList(getBlog)){
            const blogger = bloggers.find(blog => blog.author === getBlog.author)
            blogger.number += getBlog.likes
        } else {
            const blogger = new Blogger(getBlog.author, getBlog.likes)
            bloggers.push(blogger)
        }
    })

    console.log(bloggers)

    bloggers.forEach(blogger => {
        if(blogger.number > mostLikes){
            favoriteAuthor = blogger.author
            mostLikes = blogger.number
        }
    })

    logger.info(`The most blogger is ${favoriteAuthor} with ${mostLikes} `)

    return {
        author: favoriteAuthor,
        likes: mostLikes
    }
}

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
    },
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    }
]

const initialUsers = [
    {
        username: 'Michael',
        name: 'Michael Chan',
        password: 'peira2922',
    },
    {
        username: 'Edsger',
        name: 'Edsger W. Dijkstra',
        password: 'peira2922',
    },
    {
        username: 'fedepeira',
        name: 'Federico Peirano',
        password: 'salainen',
    }
]

const populateDatabase = async () => {
    logger.info('Pushing...')
    await Blog.deleteMany({})
    await User.deleteMany({})

    const userIds = []
    for (const user of initialUsers) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(user.password, saltRounds)
        const userObject = new User({
            username: user.username,
            name: user.name,
            password: passwordHash
        })
        await userObject.save()
        userIds.push({ name: user.name, id: userObject._id })
    }

    const blogIds = []
    for (const blog of initialBlogs) {
        const userId = userIds.find(user => user.name === blog.author)?.id
        if (!userId) {
            logger.error(`No se encontró un usuario para el autor: ${blog.author}`)
            continue
        }
        const blogObject = new Blog({
            ...blog,
            user: userId
        })
        await blogObject.save()
        blogIds.push(blogObject._id)
    }

    for (const userId of userIds) {
        const userObject = await User.findById(userId.id)
        const userBlogs = await Blog.find({ author: userObject.name })
        userObject.blogs = userBlogs.map(blog => blog._id)
        await userObject.save()
    }
}

const nonExistingId = async () => {
    const blog = new Blog({ content: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    dummy,
    countBlogLikes,
    countBlogsLikes,
    getFavoriteBlog,
    mostBlogs,
    mostLikes,
    blogsInDb,
    usersInDb,
    nonExistingId,
    populateDatabase
}