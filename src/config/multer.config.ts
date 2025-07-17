import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as mkdirp from 'mkdirp';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { FILE_UPLOAD_DIR } from '../lib/constants';

const uploadDir = FILE_UPLOAD_DIR;

// Ensure upload directory exists
mkdirp.sync(uploadDir);

export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // console.log(uploadDir);

      cb(null, './uploads/thumbnails');
    },
    filename: (req, file, cb) => {
      console.log('Original file name:', file.originalname);
      const randomName = uuidv4();
      const finalName = `${randomName}${extname(file.originalname)}`;
      console.log('Final file name:', finalName);
      cb(null, finalName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    allowedMimes.includes(file.mimetype)
      ? cb(null, true)
      : cb(
          new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'),
          false
        );
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};
