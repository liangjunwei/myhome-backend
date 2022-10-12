import express from 'express';
const router = express.Router();

import {
    getApprovedAndFilteredListings,
    getNotApprovedYetListings,
    getAllListingsByUserId,
    getListingById,
    createListing,
    deleteListingById,
    approveListingById,
    disapproveListingById,
    updateListingById
} from '../db/index.js';

// POST /api/listings/approved
router.post('/approved', async (req, res, next) => {
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

// GET /api/listings/user
router.get('/user', async (req, res, next) => {
    const user = req.user;

    if(!user) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const listings = await getAllListingsByUserId(user.id);
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

// PATCH /api/listings/approve/:id
router.patch('/approve/:id', async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;

    if(!user || !user.isAdmin) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const approvedListing = await approveListingById(id);
        res.send({
            message: "Listing Approved!",
            approvedListing
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

// PATCH /api/listings/disapprove/:id
router.patch('/disapprove/:id', async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;

    if(!user) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        const disapprovedListing = await disapproveListingById(id);
        res.send({
            message: "Listing Disapproved!",
            disapprovedListing
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

// PATCH /api/listings/update/:id
router.patch('/update/:id', async (req, res, next) => {
    const { id } = req.params;
    const { address, typeId, price, bedrooms, bathrooms, size, parking, pets } = req.body;
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
        const updatedListing = await updateListingById({id, address, typeId, price, bedrooms, bathrooms, size, parking, pets});
        res.send({
            message: "Listing Updated!",
            updatedListing
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

// GET /api/listings/owner-check/:id
router.get('/owner-check/:id', async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;

    const listing = await getListingById(id);

    try {
        if(!user || user.id !== listing.userId) {
            res.send({owner: false});
            return;
        }
        else {
            res.send({owner: true});
        }
    } 
    catch ({ error, message }) {
        next({ error, message });
    }
});

export default router;