import { client } from './client.js';

// create listing
const createListing = async ({ address, typeId, price, bedrooms, bathrooms, size, parking, pets, userId }) => {
    try {
        const { rows: [ listing ] } = await client.query(
            `INSERT INTO listings(address, "typeId", price, bedrooms, bathrooms, size, parking, pets, "userId")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (address) DO NOTHING
            RETURNING *;`, [address, typeId, price, bedrooms, bathrooms, size, parking, pets, userId]
        );
        
        return listing;
    } 
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// approve listing by listing id
const approveListingByListingId = async (id) => {
    try {
        const { rows: [ listing ] } = await client.query(
            `UPDATE listings
            SET approved=true
            WHERE id=$1
            RETURNING *;`, 
            [id]
        );

        return listing;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get all approved listings
const getAllApprovedListings = async () => {
    try {
        const { rows } = await client.query(
            `SELECT listings.id, listings.address, types.name AS type, 
            listings.price, listings.bedrooms, listings.bathrooms, listings.size FROM listings
            JOIN types
            ON types.id=listings."typeId"
            WHERE listings.approved=true
            ORDER BY listings.id DESC;`
        );

        return rows;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get all listings by user id
const getAllListingsByUserId = async (userId) => {
    try {
        const { rows } = await client.query(
            `SELECT listings.id, listings.approved, listings.address, types.name AS type, 
            listings.price, listings.bedrooms, listings.bathrooms, listings.size FROM listings
            JOIN types
            ON types.id=listings."typeId"
            WHERE listings."userId"=$1
            ORDER BY listings.id DESC;`,
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
    createListing,
    approveListingByListingId,
    getAllApprovedListings,
    getAllListingsByUserId
};