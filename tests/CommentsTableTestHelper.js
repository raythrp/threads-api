/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123', username = 'dicoding', date = new Date().toISOString(), content = 'Comment testing', thread_id = 'thread-123', is_deleted = false
    } = {}) {
        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)',
            values: [id, username, date, content, thread_id, is_deleted]
        }

        await pool.query(query)
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1')
    }
}

module.exports = CommentsTableTestHelper