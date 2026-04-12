const { Client } = require('pg');

async function createDb() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default db first
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='chanan_db'");
    if (res.rowCount === 0) {
      console.log('Database chanan_db does not exist. Creating...');
      await client.query('CREATE DATABASE "chanan_db"');
      console.log('Database created successfully.');
    } else {
      console.log('Database chanan_db already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDb();
