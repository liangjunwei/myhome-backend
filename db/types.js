import { client } from './client.js';

// create type
const createType = async (name) => {
    try {
        const { rows: [ type ] } = await client.query(
            `INSERT INTO types(name)
            VALUES ($1)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;`, [name]
        );
        
        return type;
    } 
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// get all types
const getAllTypes = async () => {
    try {
        const { rows } = await client.query(
            `SELECT * FROM types;`
        );

        return rows;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

// delete type
const deleteTypeById = async (id) => {
    try {
        const { rows: [ type ] } = await client.query(
            `DELETE FROM types
            WHERE id=$1
            RETURNING *;`, [id]
        );
        return type;
    }
    catch(error) {
        console.error("Error: ", error);
        throw error;
    }
}

export {
    createType,
    getAllTypes,
    deleteTypeById
};