import express from 'express';
const router = express.Router();

import { getAllTypes } from '../db/index.js';

// GET /api/types
router.get('/', async (req, res, next) => {
    try {
        const types = await getAllTypes();
        res.send(types);
    } 
    catch ({ error, message }) {
        next({ error, message });
    }
});

export default router;