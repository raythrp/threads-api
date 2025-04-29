class NewComment {
    constructor(payload) {
        this._verifyPayload(payload)

        const { thread_id, content, username } = payload

        this.thread_id = thread_id
        this.content = content
        this.username = username
    }

    _verifyPayload({ thread_id, content, username }) {
        if ([thread_id, content, username].some(val => val === undefined)) {
            throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if ([thread_id, content, username].some(val => typeof val !== 'string')) {
            throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = NewComment