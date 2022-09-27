import express from 'express';
const router = express.Router();
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/images/upload
router.post('/upload', upload.array('images', 10), async (req, res, next) => {
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    try {
        res.send({
            message: "Images Uploaded!"
        });
    }
    catch({ error, message }) {
        next({ error, message });
    }
});

export default router;