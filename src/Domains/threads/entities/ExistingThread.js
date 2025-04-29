const ExistingComment = require('../../comments/entities/ExistingComment')
class ExistingThread {
    constructor(payload) {
        this._verifyPayload(payload);
        
        const { title, body, username, id, date, is_deleted, comments } = payload;

        this.title = title;
        this.body = body;
        this.username = username;
        this.id = id;
        this.date = date;
        this.is_deleted = is_deleted;
        this.comments = comments;
    }

    _verifyPayload({ title, body, username, id, date, is_deleted, comments = [] }) {
        if ([username, title, body, id, date, is_deleted].some(val => val === undefined)) {
            throw new Error('EXISTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof username !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof id !== 'string' || typeof is_deleted !== 'boolean') {
            throw new Error('EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        if (!Array.isArray(comments)) {
            throw new Error('EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        const isValidComments = comments.every(comment => comment instanceof ExistingComment);
        if (!isValidComments) {
            throw new Error('EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ExistingThread