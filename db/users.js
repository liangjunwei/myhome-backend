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

// check if username is existed when user register
const usernameAvailability = async (username) => {
    try {
        const { rows: [ user ] } = await client.query(
            `SELECT * FROM users
            WHERE username=$1;`, 
            [username]
        );

        if(user !== undefined) {
            return false;
        }

        return true;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get user by username
const getUserByUsername = async (username) => {
    try {
        const { rows: [ user ] } = await client.query(
            `SELECT * FROM users
            WHERE username=$1;`, 
            [username]
        );

        return user;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// deactivate user by username
const deactivateUserByUsername = async (username) => {
    try {
        const { rows: [ user ] } = await client.query(
            `UPDATE users
            SET "isActive"=false
            WHERE username=$1
            RETURNING *;`, 
            [username]
        );
    
        if(user !== undefined) {
            delete user.password;
        }
        return user;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// verify password when user login in
const verifyPassword = async ({ username, password }) => {
    try {
        const user = await getUserByUsername(username);
        
        if(user !== undefined) {
          const hashedPassword = user.password;
          const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    
          if(passwordsMatch) {
            delete user.password;
            return user;
          }
          else {
            return undefined;
          }
        }
        
        return user;
      }
      catch(error) {
        console.error("Error: ", error);
        throw error;
      }
}

export {
    createUser,
    createAdmin,
    usernameAvailability,
    deactivateUserByUsername,
    verifyPassword
};