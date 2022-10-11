import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const router = express.Router();

import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getCoverImageByListingId, getAllImagesByListingId, storeImageName, 
         setCoverImageById, removeCoverImageById } from '../db/index.js';

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/images/upload
router.post('/upload', upload.array('images', 10), async (req, res, next) => {
    const { listingId } = req.body;
    
    try {
        for(let i = 0; i < req.files.length; i++) {

            const imageName = randomImageName();
            const params = {
                Bucket: bucketName,
                Key: imageName,
                Body: req.files[i].buffer,
                ContentType: req.files[i].mimetype
            }
            
            const command = new PutObjectCommand(params);
            await s3.send(command);

            const newImage = await storeImageName({ listingId, name: imageName });

            const cover = await getCoverImageByListingId(listingId);
            if(!cover) {
                await setCoverImageById(newImage.id);
            }
        }

        res.send({
            message: "Images Uploaded!"
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

// GET /api/images/cover/:listingId
router.get('/cover/:listingId', async (req, res, next) => {
    const { listingId } = req.params;

    try {
        const cover = await getCoverImageByListingId(listingId);
    
        const getObjectParams = {
            Bucket: bucketName,
            Key: cover.name
        }

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        
        res.send({
            imageUrl: url
        });
    } 
    catch({ error, message }) {
        next({ error, message });
    }
});

// GET /api/images/:listingId
router.get('/:listingId', async (req, res, next) => {
    const { listingId } = req.params;

    try {
        const images = await getAllImagesByListingId(listingId);

        const allImages = [];

        for(let i = 0; i < images.length; i++) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: images[i].name
            }

            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

            allImages.push({id: images[i].id, cover: images[i].cover, url: url});
        }
        
        res.send({
            allImages
        });
    } 
    catch({ error, message }) {
        next({ error, message });
    }
});

// PATCH /api/images/set-cover/:id
router.patch('/set-cover/:id', async (req, res, next) => {
    const { id } = req.params;
    const { oldCoverId } = req.body;
    const user = req.user;

    if(!user) {
        next({
            error: "Unauthorized Error",
            message: "You don't have permission to perform this action!"
        });
        return;
    }

    try {
        await removeCoverImageById(oldCoverId);
        const newCoverImage = await setCoverImageById(id);
        
        res.send({
            message: "Cover Image Set!",
            newCoverImage
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

export default router;