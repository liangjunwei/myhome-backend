import express from 'express';
const router = express.Router();

import { 
    getAllMessagesSentByUser,
    getAllMessagesReceivedByUser,
    createMessage,
    deleteMessagesByListingId,
    getListingById
} from '../db/index.js';

// GET /api/messages/send/:userId
router.get('/send/:userId', async (req, res, next) => {
    const { userId } = req.params;
    const user = req.user;

    if(!user || user.id !== parseInt(userId)) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const messages = await getAllMessagesSentByUser(userId);
        res.send(messages);
    } 
    catch({ error, message }) {
        next({ error, message });
    }
});

// GET /api/messages/receive/:userId
router.get('/receive/:userId', async (req, res, next) => {
    const { userId } = req.params;
    const user = req.user;

    if(!user || user.id !== parseInt(userId)) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const messages = await getAllMessagesReceivedByUser(userId);
        res.send(messages);
    } 
    catch({ error, message }) {
        next({ error, message });
    }
});

// POST /api/messages/create
router.post('/create', async (req, res, next) => {
    const { listingId, senderId, receiverId, content } = req.body;
    const user = req.user;

    if(!user) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const newMessage = await createMessage({listingId, senderId, receiverId, content});
        res.send({
            message: "Message sent!",
            newMessage
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

// DELETE /api/messages/delete/:listingId
router.delete('/delete/:listingId', async (req, res, next) => {
    const { listingId } = req.params;
    const user = req.user;

    const listing = await getListingById(listingId);

    if(!user || user.id !== listing.userId) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const deletedMessages = await deleteMessagesByListingId(listingId);
        res.send({
            message: "Deleted successfully!",
            deletedMessages
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

export default router;