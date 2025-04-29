class DeleteCommentUseCase {
    constructor({
        commentRepository, threadRepository
    }) {
        this._commentRepository = commentRepository,
        this._threadRepository = threadRepository
    }

    async execute(useCasePayload) {
        this._validatePayload(useCasePayload)
        const { id, thread_id, username } = useCasePayload
        await this._verifyThread(thread_id)
        await this._verifyOwner(id, username)
        await this._commentRepository.deleteCommentById(id) 
    }

    _validatePayload(payload) {
        const { id, thread_id, username } = payload
        if (!id || !thread_id) {
            throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if ([id, thread_id, username].some(val => typeof val !== 'string')) {
            throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    async _verifyThread(thread_id) {
        const result = await this._threadRepository.getThreadById(thread_id)

        if (!result) {
            throw new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
        }
    }

    async _verifyOwner(id, username) {
        const comment = await this._commentRepository.getCommentById(id)
        if (comment.username !== username) {
            throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_ID_NOT_MEET_PAYLOAD_ID')
        }
    }
}

module.exports = DeleteCommentUseCase
