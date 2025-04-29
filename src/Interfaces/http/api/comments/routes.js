const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{thread_id}/comments',
        handler: handler.postCommentHandler,
        options: {
            auth: 'forum_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/threads/{thread_id}/comments/{comment_id}',
        handler: handler.deleteCommentHandler,
        options: {
            auth: 'forum_jwt'
        }
    },
])

module.exports = routes;