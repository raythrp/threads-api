const NewThread = require('../../../Domains/threads/entities/NewThread')
const ExistingThread = require('../../../Domains/threads/entities/ExistingThread')
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
        const mockAddedThread = new ExistingThread({
            id: 'thread-123',
            title: 'Thread Testing',
            body: 'Halo',
            username: 'dicoding',
            is_deleted: false,
            date: '2025-04-18 17:19:07.131+07',
            comments: []
        })

        const mockThreadRepository = new ThreadRepository() 

        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread))

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository
        })

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload)

        // Assert
        expect(addedThread).toStrictEqual(new ExistingThread({
          id: 'thread-123',
          username: useCasePayload.username,
          body: useCasePayload.body,
          title: useCasePayload.title,
          is_deleted: false,
          comments: [],
          date: '2025-04-18 17:19:07.131+07'
        }))
        expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload))
    })
})