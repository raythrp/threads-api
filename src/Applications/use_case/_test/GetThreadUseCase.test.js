const ExistingThread = require('../../../Domains/threads/entities/ExistingThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ExistingComment = require('../../../Domains/comments/entities/ExistingComment')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
    

    it('should throw error if payload data type is wrong', async () => {
        // Arrange
        const useCasePayload = {
            id: 123
        }

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: {},
            commentRepository: {}
        })

        // Action & Assert
        expect(getThreadUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })  

    it('should throw error if id is an empty string', async () => {
        const useCasePayload = { id: '' }
    
        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: {},
            commentRepository: {}
        })
    
        await expect(getThreadUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error if payload incomplete', async () => {
        // Arrange
        const useCasePayload = {}

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: {},
            commentRepository: {}
        })
        
        // Action & Assert
        expect(getThreadUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should orchestrate the get thread action correctly', async () => {
        const useCasePayload = {
            id: 'thread-123'
        }

        // Mocking mechanism
        const mockAddedThread = {
            id: useCasePayload.id,
            title: 'Comment testing',
            body: 'Halo',
            username: 'dicoding',
            is_deleted: false,
            date: '2025-04-11 15:43:23.47+07',
        }

        const mockAddedComment1 = new ExistingComment({
            id: 'comment-123',
            username: 'dicoding',
            date: '2025-04-11 15:43:23.47+07',
            content: 'Comment testing',
            thread_id: useCasePayload.id,
            is_deleted: false,
        })

        const mockAddedComment2 = new ExistingComment({
            id: 'comment-122',
            username: 'dicoding',
            date: '2025-04-11 15:43:23.47+07',
            content: 'Comment testing',
            thread_id: useCasePayload.id,
            is_deleted: false
        })

        const mockDeletedComment = new ExistingComment({
            id: 'comment-999',
            username: 'deleted_user',
            date: '2025-04-11 15:43:23.47+07',
            content: 'should not appear', // this should be replaced
            thread_id: useCasePayload.id,
            is_deleted: true
        })

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread))
        mockCommentRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([
                mockAddedComment1,
                mockAddedComment2,
                mockDeletedComment
        ]))
        mockAddedThread.comments = [mockAddedComment1, mockAddedComment2]

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Act
        const retrievedThread = await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(retrievedThread).toStrictEqual(
            new ExistingThread({
                ...mockAddedThread,
                comments: [
                    mockAddedComment1,
                    mockAddedComment2,
                    new ExistingComment({
                        ...mockDeletedComment,
                        content: '**komentar telah dihapus**'
                    })
                ]
            })
        )
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id)
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.id)
    })
})