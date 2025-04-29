const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const ExistingComment = require('../../../Domains/comments/entities/ExistingComment')

describe('DeleteCommentUseCase', () => {
    it('should throw error if thread not found', async () => {
        // Arrange
        const useCasePayload = {
            thread_id: 'thread-123',
            id: 'comment-123',
            username: 'dicoding'
        }

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        mockThreadRepository.getThreadById = jest.fn(() => {return})

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        })

        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND')
        await expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.thread_id)
    })

    it('should throw error if use case payload not contain comment id', async () => {
        // Arrange
        const useCasePayload = {}
        const deleteCommmentUseCase = new DeleteCommentUseCase({})

        // Action & Assert
        await expect(deleteCommmentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error if use case payload data type is not correct', async () => {
        // Arrange
        const useCasePayload = {
            id: 123,
            thread_id: 'thread-123',
            username: 'dicoding'
        }
        const deleteCommmentUseCase = new DeleteCommentUseCase({})

        // Action & Assert
        await expect(deleteCommmentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should throw error if comment owner doesnt match the given credentials', async () => {
        // Arrange
        const useCasePayload = {
            id: 'comment-123',
            thread_id: 'thread-123',
            username: 'dicoding'
        }

        const mockCommentRepository = new CommentRepository()
        const mockThreadRepository = new ThreadRepository()

        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => { return { rowCount: 1 }})
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => { return new ExistingComment({
                id: 'comment-123',
                content: 'Comment testing',
                username: 'john doe',
                date: '2025-04-17 12:51:57.117+07',
                thread_id: 'thread-123',
                is_deleted: false
            })})
        mockCommentRepository.deleteCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve())

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository, 
            threadRepository: mockThreadRepository
        })

        // Action & Assert
        expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_ID_NOT_MEET_PAYLOAD_ID')
    })

    it('should orchestrate the delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            thread_id: 'thread-123',
            id: 'comment-123',
            username: 'dicoding'
        }

        const mockCommentRepository = new CommentRepository()
        const mockThreadRepository = new ThreadRepository()
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => { return { rowCount: 1 }})
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve( new ExistingComment({id: 'comment-123',
                content: 'Comment testing',
                username: 'dicoding', 
                date: '2025-04-17 12:52:02.775+07 ',
                thread_id: 'thread-123',
                is_deleted: false
            })))
        mockCommentRepository.deleteCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve())
        
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository
        })

        // Act
        await deleteCommentUseCase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.getThreadById)
            .toHaveBeenCalledWith(useCasePayload.thread_id)
        expect(mockCommentRepository.deleteCommentById)
            .toHaveBeenCalledWith(useCasePayload.id)
    })
})