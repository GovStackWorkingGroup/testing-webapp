import multer from 'multer';
import path from 'path';

const getFileExtension = (mimetype) => {
    const mimeToExt = {
        'application/pdf': '.pdf',
        'image/png': '.png',
        'application/msword': '.doc',
        'image/jpeg': '.jpg',
        'image/svg+xml': '.svg',
        'text/plain': '.txt',
    };
    return mimeToExt[mimetype] || '';
};

export const createFileUploadMiddleware = () => {
    const storage = multer.diskStorage({
        destination: (_req, _file, done) => done(null, 'uploads/'),
        filename: (_req, file, done) => {
            const ext = path.extname(file.originalname) || getFileExtension(file.mimetype);
            done(null, `${file.fieldname}-${Date.now()}${ext}`);
        },
    });

    return multer({ storage }).fields([
        { name: 'logo', maxCount: 1 },
        { name: 'deploymentCompliance[documentation]', maxCount: 1 },
        { name: 'deploymentCompliance[deploymentInstructions]', maxCount: 1 },
    ]);
};
