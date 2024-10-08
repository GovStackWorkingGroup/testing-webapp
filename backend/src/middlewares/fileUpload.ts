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
            let ext = path.extname(file.originalname);
            if (!ext) {
                ext = getFileExtension(file.mimetype);
            }
            done(null, `${file.fieldname}-${Date.now()}${ext}`);
        },
    });

    const limits = {
        fileSize: 1 * 1024 * 1024, // 1 MB
    };

    return multer({ storage, limits }).fields([
        { name: 'logo', maxCount: 1 },
        { name: 'deploymentCompliance[documentation]', maxCount: 1 },
        { name: 'deploymentCompliance[deploymentInstructions]', maxCount: 1 },
    ]);
};
