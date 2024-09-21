const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
})

// const limits = {
//   fileSize: 1024 * 1024 * 1.5
// }

// const uploadTasksExcel = multer({
//   storage: fileStorage,
//   limits: limits,
//   fileFilter: (req, file, cb) => {
//       let fileType = /png|jpg|jpeg/;
//       let mimeType = fileType.test(file.mimetype);
//       let extname = fileType.test(path.extname(file.originalname).toLocaleLowerCase());
//       if (mimeType && extname) {
//           cb(null, true)
//       } else {
//           req.fileValidationError = "File upload only supports, png, jpg, jpeg only";
//           return cb(null, false, req.fileValidationError);
//       }
//  }
// })



const uploadTaskPhoto = multer({ storage: fileStorage, fileFilter: fileFilter });

module.exports = uploadTaskPhoto;