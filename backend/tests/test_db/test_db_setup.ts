import knex, { Knex } from 'knex';

// Get the location of our db file
const dbPath: string = path.resolve(__dirname, './test_db.db');

// Create connection to SQLite database
const db_test: Knex = knex({
    client: 'sqlite3',
    connection: {
        filename: dbPath,
    },
    useNullAsDefault: true
});

// Export db
export default db_test;