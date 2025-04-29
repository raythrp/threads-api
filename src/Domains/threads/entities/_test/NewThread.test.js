const NewThread = require('../NewThread')

describe('a NewThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'Contoh thread',
            username: 'dicoding'
        }

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            title: 123,
            body: 'Halo',
            username: 123
        }

        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create newThread object correctly', () => {
        const payload = {
            title: 'Contoh thread',
            body: 'halo',
            username: 'dicoding'
        }

        const { username, title, body } = new NewThread(payload)

        expect(username).toEqual(payload.username)
        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
    })
})