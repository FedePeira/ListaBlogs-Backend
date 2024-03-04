// const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        console.log('Pushing data to the MongoDB')
        await helper.populateDatabase()
    })

    /* GET Users */
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    /* POST User */
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    /* POST User with short password */
    test('creation unsucceed cause password too short', async () => {
        const newUser = {
            username: 'fedepeira',
            name: 'Federico Peirano',
            password: 'sa',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    /* POST User with short password */
    test('creation unsucceed cause username too short', async () => {
        const newUser = {
            username: 'fe',
            name: 'Federico Peirano',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    /* POST User with username repeated */
    test('creation unsucceed cause username isnt unique', async () => {
        const newUser = {
            username: 'fedepeira',
            name: 'Federico Peirano',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    /* POST Blog */
    test.only('creation succeed blog', async () => {
        const newBlog = {
            title: 'Curriculum in a Page',
            author: 'Michael Chan',
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
})
