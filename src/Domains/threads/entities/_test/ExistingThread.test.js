const ExistingThread = require('../ExistingThread')
const ExistingComment = require('../../../comments/entities/ExistingComment')
describe('an ExistingThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'Contoh thread',
            username: 'dicoding'
        }

        // Action and Assert
        expect(() => new ExistingThread(payload)).toThrowError('EXISTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'thread-123',
            title: 123,
            body: 'Halo',
            username: 123,
            date: '12-12-2012',
            is_deleted: true,
            comments: [{
                id: 2,
                name: 'Halo'
            }]
        }

        expect(() => new ExistingThread(payload)).toThrowError('EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create newThread object correctly', () => {
        const payload = {
            id: 'thread-123',
            title: 'Contoh thread',
            body: 'halo',
            username: 'dicoding',
            date: new Date().toISOString(),
            is_deleted: false
        }

        const { username, title, body, id, date, is_deleted } = new ExistingThread(payload)

        expect(username).toEqual(payload.username)
        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
        expect(id).toEqual(payload.id)
        expect(date).toEqual(payload.date)
        expect(is_deleted).toEqual(payload.is_deleted)
    })

    it('should throw error when comments is not an array', () => {
        const payload = {
            id: 'thread-123',
            title: 'Judul thread',
            body: 'Isi thread',
            username: 'dicoding',
            date: new Date().toISOString(),
            is_deleted: false,
            comments: 'not-an-array' 
        }
    
        expect(() => new ExistingThread(payload)).toThrowError('EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it('should throw error when comments array contains invalid items', () => {
        const payload = {
            id: 'thread-123',
            title: 'Judul thread',
            body: 'Isi thread',
            username: 'dicoding',
            date: new Date().toISOString(),
            is_deleted: false,
            comments: [{ id: 'comment-123' }] 
        }
    
        expect(() => new ExistingThread(payload)).toThrowError('EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })
    
    it('should create ExistingThread object with valid comments array', () => {
        const comment = new ExistingComment({
            id: 'comment-123',
            content: 'ini komentar',
            username: 'dicoding',
            thread_id: 'thread-123',
            date: new Date().toISOString(),
            is_deleted: false
        })
    
        const payload = {
            id: 'thread-123',
            title: 'Judul thread',
            body: 'Isi thread',
            username: 'dicoding',
            date: new Date().toISOString(),
            is_deleted: false,
            comments: [comment]
        }
    
        const thread = new ExistingThread(payload)
    
        expect(thread.comments).toHaveLength(1)
        expect(thread.comments[0]).toBeInstanceOf(ExistingComment)
    })
})