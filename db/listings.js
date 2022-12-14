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
const approveListingById = async (id) => {
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

// disapprove listing by listing id
const disapproveListingById = async (id) => {
    try {
        const { rows: [ listing ] } = await client.query(
            `UPDATE listings
            SET approved=false
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

// get all approved listings using search bar and filter
const getApprovedAndFilteredListings = async (string, fields) => {
    const searchString = string.toLowerCase();
    const fieldsKeysArray = Object.keys(fields);
    let filterString = '';
    
    for(let i = 0; i < fieldsKeysArray.length; i++) {
        const key = fieldsKeysArray[i];

        if(fields[key].length !== 0) {

            filterString += ` AND "${key}" IN (`;

            for(let j = 0; j < fields[key].length; j++) {
                filterString += `${fields[key][j]}`;
                if(j !== fields[key].length - 1) {
                    filterString += ', ';
                }
            }

            filterString += ')';

            if(i === fieldsKeysArray.length - 1) {
                filterString += ' '; 
            }
        }
    }

    try {
        const { rows } = await client.query(
            `SELECT listings.id, listings.address, types.name AS type, 
            listings.price, listings.bedrooms, listings.bathrooms, listings.size FROM listings
            JOIN types
            ON types.id=listings."typeId"
            WHERE listings.approved=true AND lower(listings.address) LIKE '%${searchString}%'
            ${filterString} 
            ORDER BY listings.id DESC;`
        );

        return rows;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get not approved yet listings
const getNotApprovedYetListings = async () => {
    try {
        const { rows } = await client.query(
            `SELECT listings.id, listings.approved, listings.address, types.name AS type, 
            listings.price, listings.bedrooms, listings.bathrooms, listings.size FROM listings
            JOIN types
            ON types.id=listings."typeId"
            WHERE listings.approved=false
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

// get listing by id
const getListingById = async (id) => {
    try {
        const { rows: [ listing ] } = await client.query(
            `SELECT listings.*, types.name AS type, users.username FROM listings
            JOIN types
            ON types.id=listings."typeId"
            JOIN users
            ON users.id=listings."userId"
            WHERE listings.id=$1;`,
            [id]
        );

        return listing;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// update listing by id
const updateListingById = async ({id, ...fields}) => {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    
    if(setString.length === 0) {
        return undefined;
    }

    try {
        const { rows: [ listing ] } = await client.query(
          `UPDATE listings
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;`,
          Object.values(fields)
        );
    
        return listing;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// delete listing by id
const deleteListingById = async (id) => {
    try {
        const { rows: [ listing ] } = await client.query(
            `DELETE FROM listings
            WHERE id=$1
            RETURNING *;`, [id]
        );
        return listing;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

export {
    createListing,
    approveListingById,
    getAllApprovedListings,
    getAllListingsByUserId,
    getListingById,
    updateListingById,
    getNotApprovedYetListings,
    disapproveListingById,
    getApprovedAndFilteredListings,
    deleteListingById
};