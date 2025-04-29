const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
    constructor(container) {
        this._container = container
        this.postCommentHandler = this.postCommentHandler.bind(this)    
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this)    
    }

    async postCommentHandler(request, h) {
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)

        const { username } = await request.auth.credentials
        const params = request.params
        const payload = request.payload
        const addedComment = await addCommentUseCase.execute({
            content: payload.content,
            thread_id: params.thread_id,
            username: username
        })
        
        const response = h.response({
            status: 'success',
            data: {
                addedComment: {
                    id: addedComment.id,
                    content: addedComment.content,
                    owner: addedComment.username
                }
            }
        })
        response.code(201)
        return response
    }

    async deleteCommentHandler(request, h) {
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
        const { username } = await request.auth.credentials
        const params = request.params
        const payload = {
            id: params.comment_id,
            thread_id: params.thread_id,
            username: username
        }
        
        await deleteCommentUseCase.execute(payload)
        
        const response = h.response({
            status: 'success'
        })
        response.code(200)
        
        return response
    }
}

module.exports = CommentsHandler