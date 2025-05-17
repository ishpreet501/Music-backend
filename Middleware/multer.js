const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/mkv', 'video/webm'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only video files allowed"), false);
};

module.exports = multer({ storage, fileFilter });
