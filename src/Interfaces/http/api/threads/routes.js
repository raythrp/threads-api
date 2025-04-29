const routes = (handler) => ([
    {
      method: 'POST',
      path: '/threads',
      handler: handler.postThreadHandler,
      options: {
        auth: 'forum_jwt'
      }
    },
    {
      method: 'GET',
      path: '/threads/{thread_id}',
      handler: handler.getThreadHandler,
    },
  ]);
  
  module.exports = routes;
  