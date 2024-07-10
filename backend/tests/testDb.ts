import db from '../models/db';

async function testDatabaseConnection() {
    try {
        // Create a test table
        await db.schema.createTable('test_table', (table) => {
            table.increments('id').primary();
            table.string('name');
        });
        console.log('Table created successfully.');

        // Insert data into the test table
        await db('test_table').insert({ name: 'Test User' });
        console.log('Data inserted successfully.');

        // Query data from the test table
        const users = await db('test_table').select('*');
        console.log('Data queried successfully:', users);

        // Clean up: Drop the test table
        await db.schema.dropTable('test_table');
        console.log('Table dropped successfully.');

    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the test function
testDatabaseConnection();
