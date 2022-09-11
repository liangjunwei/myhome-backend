import { client } from './client.js';
import { 
    createAdmin,
    createUser,
    usernameAvailability,
    deactivateUserByUsername,
    verifyPassword,
    createType,
    getAllTypes,
    createListing,
    approveListingById,
    getAllApprovedListings,
    getAllListingsByUserId,
    getListingById,
    updateListingById,
    createMessage,
    getAllMessagesSentByUser,
    getAllMessagesReceivedByUser
} from './index.js';
import { admins, users, types, listings } from './initial_data.js';

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
            name VARCHAR(255) UNIQUE NOT NULL
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
            name TEXT UNIQUE NOT NULL,
            cover BOOLEAN DEFAULT false
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
        
        console.log("Checking username availability(user1)...");
        const usernameNotExisted = await usernameAvailability('user1');
        console.log(usernameNotExisted ? "Username not existed!" : "Username is already existed!");

        console.log("Deactivate user by username(user3)...");
        const deactivateUser3 = await deactivateUserByUsername('user3');
        console.log(deactivateUser3 ? deactivateUser3 : "User not existed!");

        console.log("Logging in...");
        const user2Login = await verifyPassword({ username: 'user2', password: 'userpassword2' });
        console.log(user2Login ? user2Login : "Username or password is incorrect, please try again!");

        console.log("Createing home types...");
        const homeTypes = await Promise.all(types.map(createType));
        console.log(homeTypes);

        console.log("Getting all types...");
        const allTypes = await getAllTypes();
        console.log(allTypes);

        console.log("Creating listings...");
        const newListings = await Promise.all(listings.map(createListing));
        console.log(newListings);

        console.log("Approved some listings...");
        const approvedListing1 = await approveListingById(1);
        console.log(approvedListing1);
        const approvedListing4 = await approveListingById(4);
        console.log(approvedListing4);

        console.log("Getting all approved listings...");
        const allApprovedListings = await getAllApprovedListings();
        console.log(allApprovedListings);

        console.log("Getting all listings by user id 5...");
        const allListingsByUserId5 = await getAllListingsByUserId(5);
        console.log(allListingsByUserId5);

        console.log("Getting listing 2...");
        const listing2 = await getListingById(2);
        console.log(listing2);

        console.log("Updating listing 4...");
        const updatedListing4 = await updateListingById({id: 4, price: 1200, bathrooms: 2, parking: 2});
        console.log(updatedListing4);

        console.log("Sending a message from user id 4 to user id 6...");
        const newMessage1 = await createMessage({listingId: 4, senderId: 4, receiverId: 6, content: "Hello I am interested in..."});
        console.log(newMessage1);

        console.log("Sending second message from user id 4 to user id 6...");
        const newMessage2 = await createMessage({listingId: 4, senderId: 4, receiverId: 6, content: "Hello again..."});
        console.log(newMessage2);

        console.log("Replying from user id 6 to user id 4...");
        const newMessage3 = await createMessage({listingId: 4, senderId: 6, receiverId: 4, content: "Hey how are you?"});
        console.log(newMessage3);

        console.log("Replying second message from user id 6 to user id 4...");
        const newMessage4 = await createMessage({listingId: 4, senderId: 6, receiverId: 4, content: "How to contact you?"});
        console.log(newMessage4);

        console.log("Getting all messages sent by user id 4...");
        const sentMessagesBy4 = await getAllMessagesSentByUser(4);
        console.log(sentMessagesBy4);

        console.log("Getting all messages received by user id 4...");
        const receivedMessagesBy4 = await getAllMessagesReceivedByUser(4);
        console.log(receivedMessagesBy4);
    } catch (error) {
        console.error(error);
        throw error;
    }

}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());