import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const { JWT_SECRET } = process.env;

import { getUserById } from '../db/index.js';

import usersRouter from './users.js';
import typesRouter from './types.js';
import messagesRouter from './messages.js';
import listingsRouter from './listings.js';

// Authorize and attach current user to request
router.use(async (req, res, next) => {
    const prefix = 'Bearer';
    const auth = req.header('Authorization');
    
    if(!auth) {
        next();
    } 
    else if(auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length + 1);
        
        try {
            const { id } = jwt.verify(token, JWT_SECRET);
            
            if(id) {
                req.user = await getUserById(id);
                next();
            }
        } 
        catch ({ error, message }) {
            next({ error, message });
        }
    } 
    else {
        next({
            error: 'Malformed Authorization Header',
            message: `Authorization token must start with ${ prefix }`
        });
    }
});

// /api/users
router.use('/users', usersRouter);

// /api/types
router.use('/types', typesRouter);

// /api/messages
router.use('/messages', messagesRouter);

// /api/listings
router.use('/listings', listingsRouter);

// Server health check
router.get('/health', async (req, res, next) => {
    res.send({
        message: 'My Home server is up and running.'
    });
});

// 404 Error
router.use((req, res, next) => {
    res.status(404);
    res.send({message: `This page does not exist.`});
});

// Error handling
router.use((error, req, res, next) => {
    res.send({
        error: error.error,
        message: error.message
    });
});

export default router;