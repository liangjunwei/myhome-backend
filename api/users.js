import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const { JWT_SECRET } = process.env;

import {
    createUser,
    usernameAvailability,
    verifyPassword,
    deactivateUserByUsername
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

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await verifyPassword({username, password});
        
        if(user === undefined) {
            next({
                error: "Incorrect Information Error",
                message: "Your username or password is incorrect, Please try again!",
            });
            return;
        }

        if(!user.isActive) {
            next({
                error: "User Deactivated Error",
                message: "This user account has been deactivated by admin!"
            });
            return;
        }
        
        const token = jwt.sign({ id: user.id, username}, JWT_SECRET, { expiresIn: "1w" });
        res.send({
            message: "You're logged in!", 
            user, 
            token
        });
    }
    catch({ error, message }) {
        next({ error, message });
    } 
});

// PATCH /api/users/deactivate
router.patch('/deactivate', async (req, res, next) => {
    const { username } = req.body;
    const user = req.user;

    if(!user || !user.isAdmin) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    if(user.username === username) {
        next({
            error: "Username Error",
            message: "You can't deactivate yourself!"
        });
        return;
    }

    try {
        const deactivatedUser = await deactivateUserByUsername(username);
        
        if(deactivatedUser === undefined) {
            next({
                error: "Username Not Existed Error",
                message: "Username is not existed!"
            });
            return
        }

        res.send({
            message: "Deactivated successfully!", 
            deactivatedUser
        });
    } 
    catch ({error, message}) {
        next ({error, message});
    }
});

export default router;