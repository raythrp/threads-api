const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
    })
    
    afterAll(async () => {
        await pool.end()
    })

    describe('addComment function', () => {
        it('should add comment to database correctly', async () => {
            // Arrange
            const fakeIdGenerator = () => '123'
            const newComment = new NewComment({
                content: 'Comment testing',
                thread_id: 'thread-123',
                username: 'dicoding'
            })
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(newComment)

            // Assert
            expect(addedComment).toEqual(expect.objectContaining({
                content: 'Comment testing',
                thread_id: 'thread-123',
                username: 'dicoding'
            }))
            expect(new Date(addedComment.date)).toBeInstanceOf(Date)
        })
    })

    describe('getCommentById function', () => {
        it('should throw InvariantError when comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            return expect(commentRepositoryPostgres.getCommentById('comment-123')).rejects.toThrowError(NotFoundError)
        })

        it('should return comments data when comment found', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment()
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action
            const addedComment = await commentRepositoryPostgres.getCommentById('comment-123')

            // Assert
            expect(addedComment).toEqual(expect.objectContaining({
                content: 'Comment testing',
                thread_id: 'thread-123',
                username: 'dicoding'
            }))
            expect(new Date(addedComment.date)).toBeInstanceOf(Date)
        })
    })

    describe('deleteCommentById function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            return expect(commentRepositoryPostgres.getCommentById('comment-123')).rejects.toThrowError(NotFoundError)
        })

        it('should throw NotFoundError if comment is already deleted', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment()
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
        
            // Delete it once
            await commentRepositoryPostgres.deleteCommentById('comment-123')
        
            // Try deleting again
            await expect(commentRepositoryPostgres.deleteCommentById('comment-123'))
                .rejects.toThrowError(NotFoundError)
        })

        it('should return deleted comment value', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment()
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action
            const deletedComment = await commentRepositoryPostgres.deleteCommentById('comment-123')

            // Assert
            expect(deletedComment).toEqual(expect.objectContaining({
                content: 'Comment testing',
                thread_id: 'thread-123',
                username: 'dicoding',
                is_deleted: true,
                id: 'comment-123'
            }))
            expect(new Date(deletedComment.date)).toBeInstanceOf(Date)
        })
    })

    describe('getCommentsByThreadId function', () => {
        it('should return empty object', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action
            const result = await commentRepositoryPostgres.getCommentsByThreadId('thread-123')

            // Assert
            expect(result).toEqual([])
            
        })

        it('should return comments data when comments found', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment()
            await CommentsTableTestHelper.addComment({ id: 'comment-122' })
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action
            const result = await commentRepositoryPostgres.getCommentsByThreadId('thread-123')

            // Assert
            expect(result).toHaveLength(2); 
            expect(result[0]).toHaveProperty('content', 'Comment testing');
            expect(result[1]).toHaveProperty('username', 'dicoding');
        })
    })
})