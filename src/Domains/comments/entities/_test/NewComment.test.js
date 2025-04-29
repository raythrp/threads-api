const NewComment = require('../NewComment')

describe('a NewComment Entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {}

        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            thread_id: 'thread-123',
            content: 123,
            username: 'user-123'
        }

        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            thread_id: 'thread-123',
            content: 'Thread testing',
            username: 'user-123'
        }

        // Action
        const { thread_id, content, username } = new NewComment(payload)

        // Assert
        expect(thread_id).toEqual(payload.thread_id)
        expect(content).toEqual(payload.content)
        expect(username).toEqual(payload.username)
    })
})