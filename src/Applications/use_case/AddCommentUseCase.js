const NewComment = require("../../Domains/comments/entities/NewComment")

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository,
        this._threadRepository = threadRepository
    }

    async execute(useCasePayload) {
        this._validatePayload(useCasePayload)
        const { thread_id } = useCasePayload
        await this._verifyThread(thread_id)
        const newComment = new NewComment(useCasePayload)
        return this._commentRepository.addComment(newComment)
    }

    _validatePayload(payload) {
        const { content, thread_id, username } = payload
        if (!content || !thread_id || !username) {
            throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if ([content, thread_id, username].some(val => typeof val !== 'string')) {
            throw new Error('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    async _verifyThread(thread_id) {
        await this._threadRepository.getThreadById(thread_id)
    }
}

module.exports = AddCommentUseCase