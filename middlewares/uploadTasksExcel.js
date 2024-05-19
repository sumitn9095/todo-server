const multer = require("multer")

const fileStorageTaskExcel = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/xlsx');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

const uploadTasksExcel = multer({ storage: fileStorageTaskExcel })

module.exports = uploadTasksExcel;