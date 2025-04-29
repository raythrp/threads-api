const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoints', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const loginRequestPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayload = {
                title: 'Thread testing',
                body: 'Halo',
                username: 'dicoding'
            }

            const server = await createServer(container)
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                  username: 'dicoding',
                  password: 'secret',
                  fullname: 'Dicoding Indonesia',
                },
              });

              // login to user
              const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginRequestPayload,
              });
              const { accessToken } = JSON.parse(loginResponse.payload).data

              // Action
              const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
              })

              // Assert
              const responseJson = JSON.parse(response.payload)
              expect(response.statusCode).toEqual(201);
              expect(responseJson).toBeInstanceOf(Object);
              expect(responseJson.status).toBe('success');

              expect(responseJson.data).toBeInstanceOf(Object);
              expect(responseJson.data.addedThread).toBeInstanceOf(Object);

              expect(typeof responseJson.data.addedThread.id).toBe('string');
              expect(responseJson.data.addedThread.id).not.toBe('');

              expect(typeof responseJson.data.addedThread.title).toBe('string');
              expect(responseJson.data.addedThread.title).not.toBe('');

              expect(typeof responseJson.data.addedThread.owner).toBe('string');
              expect(responseJson.data.addedThread.owner).not.toBe('');
        })
    })

    describe('when GET /threads/{thread_id}', () => {
        it('should response 200 and get correct thread and its comments', async () => {
            // Arrange
            const server = await createServer(container)
            const thread_id = 'thread-123'
            await ThreadsTableTestHelper.addThread({ id: thread_id})
            await CommentsTableTestHelper.addComment({})
            await CommentsTableTestHelper.addComment({
                id: 'comment-122'
            })

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${thread_id}`
            })

            // Assert
            expect(response.statusCode).toEqual(200)
            const responseJson = JSON.parse(response.payload);
            expect(typeof responseJson).toBe('object');
            expect(responseJson.status).toBe('success');
            expect(typeof responseJson.data).toBe('object');
            expect(typeof responseJson.data.thread).toBe('object');

            const thread = responseJson.data.thread;

            expect(typeof thread.id).toBe('string');
            expect(thread.id).not.toBe('');
            expect(thread.title).toBe('Contoh Thread');
            expect(thread.body).toBe('Ini adalah contoh thread, digunakan sebagai testing');
            expect(typeof thread.date).toBe('string');
            expect(thread.username).toBe('dicoding');
            expect(Array.isArray(thread.comments)).toBe(true);
            expect(thread.comments.length).toBe(2);

            const [comment1, comment2] = thread.comments;

            expect(typeof comment1).toBe('object');
            expect(typeof comment1.id).toBe('string');
            expect(comment1.username).toBe('dicoding');
            expect(typeof comment1.date).toBe('string');
            expect(comment1.content).toBe('Comment testing');

            expect(typeof comment2).toBe('object');
            expect(typeof comment2.id).toBe('string');
            expect(comment2.username).toBe('dicoding');
            expect(typeof comment2.date).toBe('string');
            expect(comment2.content).toBe('Comment testing');
        })
    })
})