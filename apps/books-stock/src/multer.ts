import multer from "multer";
import { Request } from "express";
import path from "path";

const multerCsvFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only csv file."));
  }
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export const upload = multer({
  storage: multerStorage,
  fileFilter: multerCsvFilter
});
