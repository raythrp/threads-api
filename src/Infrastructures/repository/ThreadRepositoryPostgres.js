const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ExistingThread = require('../../Domains/threads/entities/ExistingThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addThread(NewThread) {
        const { username, title, body } = NewThread
        const id = `thread-${this._idGenerator()}`
        const date = new Date().toISOString()

        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, body, username, date, is_deleted',
            values: [id, username, date, title, body]
        }

        const result = await this._pool.query(query)

        return new ExistingThread({ ...result.rows[0] })
    }

    async getThreadById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan')
        }
        
        return new ExistingThread({ ...result.rows[0]})
    }
}

module.exports = ThreadRepositoryPostgres