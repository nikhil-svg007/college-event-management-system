import multer from 'multer';
import path from 'path';

// Decide where and how files are saved
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // save files in uploads folder
  },

  filename(req, file, cb) {
    // create unique filename and keep extension
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Allow only image files
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;

  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  ); // check extension

  const mimetype = filetypes.test(file.mimetype); // check mime type

  if (extname && mimetype) {
    cb(null, true); // accept file
  } else {
    cb('Images only'); // reject file
  }
}

// Multer middleware used in routes
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
