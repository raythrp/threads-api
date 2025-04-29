/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        username: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        date: {
            type: 'TIMESTAMPTZ',
            notNull: true,
        },
        title: {
            type: 'TEXT',
            notNull: true
        },
        body: {
            type: 'TEXT',
            notNull: true
        },
        is_deleted: {
            type: 'boolean',
            default: false,
            notNull: true
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('threads')
};
