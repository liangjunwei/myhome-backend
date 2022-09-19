import express from 'express';
const router = express.Router();

import {
    getApprovedAndFilteredListings,
    getNotApprovedYetListings,
    getAllListingsByUserId,
    getListingById,
    createListing,
    deleteListingById
} from '../db/index.js';

// GET /api/listings/approved
router.get('/approved', async (req, res, next) => {
    const { searchString, typeId, bedrooms, bathrooms } = req.body;

    try {
        const listings = await getApprovedAndFilteredListings(searchString, {typeId, bedrooms, bathrooms});
        res.send(listings);
    } 
    catch ({ error, message }) {
        next({ error, message });
    }
});

// GET /api/listings/not-approved
router.get('/not-approved', async (req, res, next) => {
    const user = req.user;

    if(!user || !user.isAdmin) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const listings = await getNotApprovedYetListings();
        res.send(listings);
    } 
    catch ({ error, message }) {
        next({ error, message });
    }
});

// GET /api/listings/user/:userId
router.get('/user/:userId', async (req, res, next) => {
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
        const listings = await getAllListingsByUserId(userId);
        res.send(listings);
    } 
    catch ({ error, message }) {
        next({ error, message });
    }
});

// GET /api/listings/:id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const listing = await getListingById(id);
        if(listing) {
            res.send(listing);
        }
        else {
            next({
                error: "Listing Not Existed Error",
                message: `Listing id ${id} not existed!`
            });
        }
    } 
    catch ({ error, message }) {
        next({ error, message });
    }
});

// POST /api/listings/create
router.post('/create', async (req, res, next) => {
    const { address, typeId, price, bedrooms, bathrooms, size, parking, pets } = req.body;
    const user = req.user;

    if(!user) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const newListing = await createListing({ 
            address, typeId, price, bedrooms, bathrooms, size, parking, pets, userId: user.id 
        });
        res.send(newListing);
    } 
    catch ({ error, message }) {
        next({ error, message });
    }
});

// DELETE /api/listings/delete/:id
router.delete('/delete/:id', async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;

    const listing = await getListingById(id);

    if(!user || user.id !== listing.userId) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const deletedListing = await deleteListingById(id);
        res.send({
            message: "Deleted successfully!",
            deletedListing
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

export default router;