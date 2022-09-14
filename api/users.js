import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const { JWT_SECRET } = process.env;

import {
    createUser,
    usernameAvailability
} from '../db/index.js';

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const usernameIsAvailability = await usernameAvailability(username);

        if(!usernameIsAvailability) {
            next({
                error: "User Exists Error",
                message: `Username ${username} is already taken.`
            });
            return;
        }

        if(password.length < 8) {
            next({
                error: "Password Length Error",
                message: "Password should be more than 8 characters."
            });
            return;
        }

        const user = await createUser({username, password});

        const token = jwt.sign({ id: user.id, username}, JWT_SECRET, { expiresIn: "1w" });
        
        res.send({
            message: "Thanks for signing up!", 
            token, 
            user
        });
    }
    catch({ error, message }) {
        next({ error, message });
    } 
});

export default router;