import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const router = express.Router();

import multer from 'multer';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto';

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
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    try {
        for(let i = 0; i < req.files.length; i++) {

            const params = {
                Bucket: bucketName,
                Key: randomImageName(),
                Body: req.files[i].buffer,
                ContentType: req.files[i].mimetype
            }
            
            const command = new PutObjectCommand(params);
            await s3.send(command);
        }

        res.send({
            message: "Images Uploaded!"
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

export default router;