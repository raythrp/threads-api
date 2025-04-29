/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        username: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        date: {
            type: 'TIMESTAMPTZ',
            notNull: true
        },
        content: {
            type: 'TEXT',
            notNull: true
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_deleted: {
            type: 'boolean',
            default: false,
            notNull: true
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('comments')
};
