const listHelper = require('../utils/list_helper')

describe('Bienvenido a la prueba de funciones auxiliares y pruebas unitarias', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })
    describe('total likes', () => {

        const listWithOneBlog = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 5,
                __v: 0
            }
        ]

        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 12,
                __v: 0
            },
            {
                _id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 10,
                __v: 0
            },
            {
                _id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
                __v: 0
            },
            {
                _id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 2,
                __v: 0
            }
        ]

        const favortiteBlog = {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        }

        test('of empty list is zero', () => {
            const blogs = []

            const result = listHelper.isEmpty(blogs)
            expect(result).toBe(0)
        })
        test('when list has only one blog equals the likes of that', () => {
            const result = listHelper.countBlogLikes(listWithOneBlog)
            expect(result).toBe(5)
        })
        test('of a bigger list is calculated right', () => {
            const likes = countLikes()
            const result = listHelper.countBlogsLikes(blogs)
            expect(result).toBe(likes)
        })
        function countLikes() {
            let likes = 0
            blogs.forEach(blog => {
                likes += blog.likes
            })
            return likes
        }
        test('make sure this is the favorite blog', () => {
            const result = listHelper.getFavoriteBlog(blogs)
            expect(result).toEqual(favortiteBlog)
        })
        test('returns the author with the most blogs', () => {
            const result = listHelper.mostBlogs(blogs)
            expect(result).toEqual({
                author: 'Robert C. Martin',
                blogs: 3
            })
        })
        test.only('returns the author with the most likes', () => {
            const result = listHelper.mostLikes(blogs)
            expect(result).toEqual({
                author: 'Edsger W. Dijkstra',
                likes: 17
            })
        })
    })
})
