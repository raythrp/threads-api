const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoints', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
    })

    describe('when POST /comments', () => {
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const loginRequestPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const addThreadRequestPayload = {
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

              // Add Thread
              const addThreadResponse = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: addThreadRequestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
              })

              const addThreadResponseJson = JSON.parse(addThreadResponse.payload)
              const thread_id = addThreadResponseJson.data.addedThread.id

              const requestPayload = {
                content: 'Comment Testing'
              }

              // Action
              const response = await server.inject({
                method: 'POST',
                url: `/threads/${thread_id}/comments`,
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
              expect(responseJson.data.addedComment).toBeInstanceOf(Object);

              expect(typeof responseJson.data.addedComment.id).toBe('string');
              expect(responseJson.data.addedComment.id).not.toBe('');

              expect(typeof responseJson.data.addedComment.content).toBe('string');
              expect(responseJson.data.addedComment.content).not.toBe('');

              expect(typeof responseJson.data.addedComment.owner).toBe('string');
              expect(responseJson.data.addedComment.owner).not.toBe('');
        })
    })

    describe('when DELETE /comments', () => {
        it('should response 200 and success status', async () => {
            // Assert
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

            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const loginRequestPayload = {
                username: 'dicoding',
                password: 'secret'
            }

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginRequestPayload,
            });
            const { accessToken } = JSON.parse(loginResponse.payload).data

            const thread_id = 'thread-123'
            const comment_id = 'comment-123'

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${thread_id}/comments/${comment_id}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            expect(response.statusCode).toEqual(200)
            const responseJson = JSON.parse(response.payload) 
            expect(responseJson.status).toEqual('success')
        })
    })
})
