import { client } from './client.js';

// create message
const createMessage = async ({ listingId, senderId, receiverId, content }) => {
    try {
        const { rows: [ message ] } = await client.query(
            `INSERT INTO messages("listingId", "senderId", "receiverId", content)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`, [listingId, senderId, receiverId, content]
        );
        
        return message;
    } 
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// delete message by id
const deleteMessagesByListingId = async (listingId) => {
    try {
        const { rows } = await client.query(
            `DELETE FROM messages
            WHERE "listingId"=$1
            RETURNING *;`, [listingId]
        );
        return rows;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get all messages sent by a user
const getAllMessagesSentByUser = async (userId) => {
    try {
        const { rows } = await client.query(
            `SELECT * FROM messages
            WHERE "senderId"=$1
            ORDER BY id DESC;`, 
            [userId]
        );

        return rows;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get all messages received by a user
const getAllMessagesReceivedByUser = async (userId) => {
    try {
        const { rows } = await client.query(
            `SELECT * FROM messages
            WHERE "receiverId"=$1
            ORDER BY id DESC;`, 
            [userId]
        );

        return rows;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

export {
    createMessage,
    deleteMessagesByListingId,
    getAllMessagesSentByUser,
    getAllMessagesReceivedByUser
};