const NewThread = require('../../../Domains/threads/entities/NewThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
    it('should orchestrate the add thread actions correctly', async () => {
        const useCasePayload = {
            title: 'Thread Testing',
            body: 'Halo',
            username: 'dicoding'
        }

        // Mocking mechanism
        const mockAddedThread = {
            id: 'thread-123',
            title: useCasePayload.title,
            body: useCasePayload.body,
            username: useCasePayload.username,
        }
        const mockThreadRepository = new ThreadRepository() 

        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread))

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository
        })

        // Act
        const addedThread = await addThreadUseCase.execute(useCasePayload)

        // Assert
        expect(addedThread).toStrictEqual(mockAddedThread)
        expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload))
    })
})