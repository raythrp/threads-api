const ExistingComment = require("../../Domains/comments/entities/ExistingComment")
const ExistingThread = require("../../Domains/threads/entities/ExistingThread")

class GetThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
    }

    async execute(useCasePayload) {
        const { id } = useCasePayload
        this._validatePayload({ id: id })
        const thread = await this._threadRepository.getThreadById(id)
        const comments = await this._commentRepository.getCommentsByThreadId(id)
        const formattedComments = comments.map(comment => {
            const content = comment.is_deleted ? '**komentar telah dihapus**' : comment.content
            return new ExistingComment({ ...comment, content})
        })
        const formattedThread = new ExistingThread({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: thread.date,
            username: thread.username,
            is_deleted: thread.is_deleted,
            comments: formattedComments
          });

        return formattedThread
    }

    _validatePayload(payload) {
        const { id } = payload
        if (!id) {
            throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if(typeof id !== 'string') {
            throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = GetThreadUseCase