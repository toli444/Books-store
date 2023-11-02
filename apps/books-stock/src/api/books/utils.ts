import { Express, Request } from "express";
import multer from "multer";

export const multerCsvFilter = (
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

export const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  }
});
