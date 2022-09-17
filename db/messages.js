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

// delete message by listing id
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
            `SELECT messages.*, users.username AS receiver FROM messages
            JOIN users
            ON users.id=messages."receiverId"
            WHERE messages."senderId"=$1
            ORDER BY messages.id DESC;`, 
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
            `SELECT messages.*, users.username AS sender FROM messages
            JOIN users
            ON users.id=messages."senderId"
            WHERE messages."receiverId"=$1
            ORDER BY messages.id DESC;`, 
            [userId]
        );

        return rows;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// update message status by id
const updateMessageStatusById = async (id) => {
    try {
        const { rows: [ message ] } = await client.query(
            `UPDATE messages
            SET new=false
            WHERE id=$1
            RETURNING *;`, 
            [id]
        );

        return message;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get message by id
const getMessageById = async (id) => {
    try {
        const { rows: [ message ] } = await client.query(
            `SELECT * FROM messages
            WHERE id=$1;`, 
            [id]
        );

        return message;
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
    getAllMessagesReceivedByUser,
    updateMessageStatusById,
    getMessageById
};