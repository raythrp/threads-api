const ExistingComment = require('../ExistingComment')

describe('an ExistingComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            content: "sebuah comment",
        }

        // Action and Assert
        expect(() => new ExistingComment(payload)).toThrowError('EXISTING_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'comment-123',
            username: 'user-123',
            date: '12-12-2012',
            content: 123,
            thread_id: 'thread-123',
            is_deleted: 'true'
        }

        // Action and Assert
        expect(() => new ExistingComment(payload)).toThrowError('EXISTING_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should persist comment data', () => {
        const payload = {
            id: 'comment-123',
            username: 'user-123',
            date: new Date().toISOString(),
            content: 'Comment testing',
            thread_id: 'thread-123',
            is_deleted: false
        }

        // Action
        const { id, content, username, date, thread_id, is_deleted } = new ExistingComment(payload)

        // Assert
        expect(id).toEqual(payload.id)
        expect(content).toEqual(payload.content)
        expect(username).toEqual(payload.username)
        expect(date).toEqual(payload.date)
        expect(thread_id).toEqual(payload.thread_id)
        expect(is_deleted).toEqual(payload.is_deleted)
    })
})