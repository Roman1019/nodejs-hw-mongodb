import path from 'node:path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, path.resolve('src', 'tmp'));
  },
  filename: function (res, file, cd) {
    console.log(file);

    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() + 1e9);
    cd(null, uniquePrefix + '-' + file.originalname);
  },
});

export const upload = multer({ storage });
