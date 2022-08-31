import { client } from './client.js';
import { 
    createAdmin,
    createUser 
} from './index.js';
import { admins, users } from './initial_data.js';

const dropTables = async () => {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
        DROP TABLE IF EXISTS images;
        DROP TABLE IF EXISTS messages;
        DROP TABLE IF EXISTS listings;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS types;
        `);

        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

const createTables = async () => {
    try {
        console.log("Starting to build tables...");
    
        await client.query(`
          CREATE TABLE types (
            id SERIAL PRIMARY KEY,
            type VARCHAR(255) UNIQUE NOT NULL
          );
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            "isAdmin" BOOLEAN DEFAULT false,
            "isActive" BOOLEAN DEFAULT true
          );
          CREATE TABLE listings (
            id SERIAL PRIMARY KEY,
            address TEXT UNIQUE NOT NULL,
            "typeId" INTEGER REFERENCES types(id),
            price NUMERIC,
            bedrooms INTEGER,
            bathrooms INTEGER,
            size NUMERIC,
            parking INTEGER,
            pets BOOLEAN,
            "userId" INTEGER REFERENCES users(id),
            approved BOOLEAN DEFAULT false
          );
          CREATE TABLE messages (
            id SERIAL PRIMARY KEY,
            "listingId" INTEGER REFERENCES listings(id),
            "senderId" INTEGER REFERENCES users(id),
            "receiverId" INTEGER REFERENCES users(id),
            content TEXT NOT NULL,
            new BOOLEAN DEFAULT true
          );
          CREATE TABLE images (
            id SERIAL PRIMARY KEY,
            "listingId" INTEGER REFERENCES listings(id),
            name TEXT UNIQUE NOT NULL
          );
        `);
    
        console.log("Finished building tables!");
      } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
};

const rebuildDB = async () => {
    try {
        client.connect();
        await dropTables();
        await createTables();

    } catch (error) {
        console.error(error);
        throw error;
    }
};

const testDB = async () => {
    try {
        console.log("Creating Admins...");
        const newAdmins = await Promise.all(admins.map(createAdmin));
        console.log(newAdmins);
        console.log("Creating Users...");
        const newUsers = await Promise.all(users.map(createUser));
        console.log(newUsers);
    } catch (error) {
        console.error(error);
        throw error;
    }

}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());