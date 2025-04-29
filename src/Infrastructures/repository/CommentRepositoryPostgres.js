const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ExistingComment = require('../../Domains/comments/entities/ExistingComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addComment(NewComment) {
        const { thread_id, content, username } = NewComment
        const id = `comment-${this._idGenerator()}`
        const date = new Date().toISOString()

        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5) RETURNING id, content, username, thread_id, date, is_deleted',
            values: [id, username, date, content, thread_id]
        }

        const result = await this._pool.query(query)

        return new ExistingComment({ ...result.rows[0] })
    }

    async getCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('comment tidak ditemukan')
        }

        return new ExistingComment(result.rows[0])
    }

    async deleteCommentById(id) {
        const query = {
            text: 'UPDATE comments SET is_deleted = $1 WHERE id = $2 AND is_deleted = $3 RETURNING id, content, username, thread_id, date, is_deleted',
            values: [true, id, false]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('comment tidak ditemukan')
        }

        return new ExistingComment({ ...result.rows[0] })
    }

    async getCommentsByThreadId(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE thread_id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            return []
        }

        return result.rows.map(row => new ExistingComment(row))
    }
}

module.exports = CommentRepositoryPostgres