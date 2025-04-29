class ExistingComment {
    constructor(payload) {
        this._verifyPayload(payload)

        const { id, content, username, date, thread_id, is_deleted } = payload

        this.id = id
        this.content = content
        this.username = username
        this.date = date
        this.thread_id = thread_id
        this.is_deleted = is_deleted
    }

    _verifyPayload({ id, content, username, thread_id, date, is_deleted }) {
        if([id, content, username, thread_id, date, is_deleted].some(val => val === undefined)) {
            throw new Error('EXISTING_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if ([id, content, username, thread_id].some(val => typeof val !== 'string') || typeof is_deleted !== 'boolean') {
            throw new Error('EXISTING_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ExistingComment