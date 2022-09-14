import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const { JWT_SECRET } = process.env;

import usersRouter from './users.js';

// /api/users
router.use('/users', usersRouter);

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