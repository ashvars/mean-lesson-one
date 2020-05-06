const multer = require("multer");

const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg"
}

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    const valid = MIME_TYPE[file.mimetype];
    let error = new Error("Invalid mime type");
    if(valid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req,file,cb) => {
    const name = file.originalname.split(' ').join('-');
    const ext = MIME_TYPE[file.mimetype];
    cb(null, name + Date.now() + '.' + ext);
  }
});

module.exports = multer({ storage: storage }).single("image");
