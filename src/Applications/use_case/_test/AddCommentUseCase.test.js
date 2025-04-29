const NewComment = require('../../../Domains/comments/entities/NewComment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddCommentUseCase = require('../AddCommentUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('AddCommentUseCase', () => {
    it('should throw error if thread not found', async () => {
        // Arrange
        const useCasePayload = {
            content: 'Comment tesing',
            thread_id: 'thread-123',
            username: 'dicoding'
        }

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        mockThreadRepository.getThreadById = jest.fn(() => {return []})

        const adddCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        })

        await expect(adddCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError()
        await expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.thread_id)
    })

    it('should throw error if use case payload not contain needed property', async () => {
        // Arrange
        const useCasePayload = {}
        const addCommentUseCase = new AddCommentUseCase({})

        // Action & Assert
        await expect(addCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error if use case payload data type is not correct', async () => {
        // Arrange
        const useCasePayload = {
            content: 123,
            thread_id: 'thread-123',
            username: 'dicoding'
        }
        const addCommentUseCase  = new AddCommentUseCase({})

        // Action & Assert
        await expect(addCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should orchestrate the adding comment action correctly', async () => {
        const useCasePayload = {
            content: 'Comment tesing',
            thread_id: 'thread-123',
            username: 'dicoding'
        }

        // Mocking Mechanism
        const mockAddedComment = {
            id: 'comment-123',
            content: useCasePayload.content,
            thread_id: useCasePayload.thread_id,
            username: useCasePayload.username,
        }
        const mockCommentRepository = new CommentRepository()   
        const mockThreadRepository = new ThreadRepository

        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment))
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => { return { rowCount: 1 } })

        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository
        })

        // Act
        const addedComment = await addCommentUseCase.execute(useCasePayload)

        // Assert
        expect(addedComment).toStrictEqual(mockAddedComment)
        expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment(useCasePayload))
    })
})