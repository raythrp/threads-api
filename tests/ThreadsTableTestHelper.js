/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123', username = 'dicoding', date = new Date().toISOString(), title = 'Contoh Thread', body = 'Ini adalah contoh thread, digunakan sebagai testing', is_deleted = false,
    }) {
        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5, $6)',
            values: [id, username, date, title, body, is_deleted]
        }
        await pool.query(query)
    },

    async getThreadById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id]
        }

        await pool.query(query)
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1')
    }
}

module.exports = ThreadsTableTestHelper