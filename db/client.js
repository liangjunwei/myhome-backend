import pkg from 'pg';

const { Client } = pkg;
const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/myhome';
const client = new Client(connectionString);

export { client };