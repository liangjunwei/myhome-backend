import { client } from './client.js';

// store image name
const storeImageName = async ({ listingId, name }) => {
    try {
        const { rows: [ image ] } = await client.query(
            `INSERT INTO images("listingId", name)
            VALUES ($1, $2)
            RETURNING *;`, [listingId, name]
        );
        
        return image;
    } 
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// set cover image by id
const setCoverImageById = async (id) => {
    try {
        const { rows: [ image ] } = await client.query(
            `UPDATE images
            SET cover=true
            WHERE id=$1
            RETURNING *;`, 
            [id]
        );

        return image;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// remove cover image by id
const removeCoverImageById = async (id) => {
    try {
        const { rows: [ image ] } = await client.query(
            `UPDATE images
            SET cover=false
            WHERE id=$1
            RETURNING *;`, 
            [id]
        );

        return image;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get cover image by listing id
const getCoverImageByListingId = async (listingId) => {
    try {
        const { rows: [ image ] } = await client.query(
            `SELECT * FROM images
            WHERE "listingId"=$1 AND cover=true;`, 
            [listingId]
        );

        return image;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get all images by listing id
const getAllImagesByListingId = async (listingId) => {
    try {
        const { rows } = await client.query(
            `SELECT * FROM images
            WHERE "listingId"=$1
            ORDER by cover DESC, id;`, 
            [listingId]
        );

        return rows;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get image by id
const getImageById = async (id) => {
    try {
        const { rows: [ image ] } = await client.query(
            `SELECT * FROM images
            WHERE id=$1;`, 
            [id]
        );

        return image;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// delete image by id
const deleteImageById = async (id) => {
    try {
        const { rows: [ image ] } = await client.query(
            `DELETE FROM images
            WHERE id=$1
            RETURNING *;`, [id]
        );
        return image;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// delete images by listing id
const deleteImagesByListingId = async (listingId) => {
    try {
        const { rows } = await client.query(
            `DELETE FROM images
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

export {
    storeImageName,
    setCoverImageById,
    getCoverImageByListingId,
    getAllImagesByListingId,
    removeCoverImageById,
    getImageById,
    deleteImageById,
    deleteImagesByListingId
};