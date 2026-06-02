const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const NewThread = require('../../../Domains/threads/entities/NewThread')    
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addThread function', () => {
        it('should add thread to database correctly', async () => {
            // Arrange
            const fakeIdGenerator = () => '123'
            const newThread = new NewThread({
                title: 'Thread testing',
                body: 'Halo',
                username: 'dicoding'
            })
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(newThread)

            // Assert
            expect(addedThread).toEqual(expect.objectContaining({
                title: 'Thread testing',
                body: 'Halo',
                username: 'dicoding'
            }))

            const threadFromDb = await ThreadsTableTestHelper.getThreadById('thread-123')
            expect(new Date(threadFromDb.date)).toBeInstanceOf(Date)
            expect(threadFromDb).toBeDefined()
            expect(threadFromDb.title).toEqual('Thread testing')
            expect(threadFromDb.username).toEqual('dicoding')
            expect(threadFromDb.body).toEqual('Halo')
            expect(threadFromDb.is_deleted).toEqual(false)
        })
    })

    describe('getThreadById function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            // Action & Assert
            return expect(threadRepositoryPostgres.getThreadById('halo')).rejects.toThrowError(NotFoundError)
        })

        it('should return thread data when thread found', async () => {
            // Arrange
            const fakeIdGenerator = () => '123'
            const newThread = new NewThread({
                title: 'Thread testing',
                body: 'Halo',
                username: 'dicoding'
            })
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await threadRepositoryPostgres.addThread(newThread)

            // Assert
            const thread = await threadRepositoryPostgres.getThreadById('thread-123')
            expect(thread).toEqual(expect.objectContaining({
                title: 'Thread testing',
                body: 'Halo',
                username: 'dicoding'
            }))
            expect(new Date(thread.date)).toBeInstanceOf(Date)
            expect(thread).toBeDefined()
            expect(thread.title).toEqual('Thread testing')
            expect(thread.username).toEqual('dicoding')
            expect(thread.body).toEqual('Halo')
            expect(thread.is_deleted).toEqual(false)
        })
    })
})