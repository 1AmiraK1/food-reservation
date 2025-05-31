const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../public/image/uploads/profile');

const ensureUploadPathExists = (pathToEnsure) => {
  if (!fs.existsSync(pathToEnsure)) {
    try {
      fs.mkdirSync(pathToEnsure, { recursive: true });
      console.log(`Directory created: ${pathToEnsure}`);
    } catch (err) {
      console.error(`Error creating directory ${pathToEnsure}:`, err);
    }
  }
  return null; 
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const error = ensureUploadPathExists(uploadPath);
    if (error) {
      return cb(error); 
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (!isValid) {
  }
  cb(null, isValid);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = upload;