import { client } from './client.js';
import bcrypt from 'bcrypt';

// create user
const createUser = async ({ username, password }) => {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    
    try {
        const { rows: [ user ] } = await client.query(
            `INSERT INTO users(username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;`, [username, hashedPassword]
        );
        delete user.password;
        return user;
    } 
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// create admin
const createAdmin = async ({ username, password, isAdmin }) => {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    
    try {
        const { rows: [ user ] } = await client.query(
            `INSERT INTO users(username, password, "isAdmin")
            VALUES ($1, $2, $3)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;`, [username, hashedPassword, isAdmin]
        );
        delete user.password;
        return user;
    } 
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

export {
    createUser,
    createAdmin
};