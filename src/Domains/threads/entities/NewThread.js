class NewThread {
    constructor(payload) {
        this._verifyPayload(payload);
        
        const { title, body, username } = payload;

        this.title = title;
        this.body = body;
        this.username = username;
    }

    _verifyPayload({ title, body, username }) {
        if (!username || !title || !body ) {
            throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof username !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = NewThread