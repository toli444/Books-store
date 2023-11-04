import { Request } from "express";
import multer from "multer";
import fs, { PathLike } from "fs";
import * as csv from "fast-csv";
import path from "path";

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
    cb(null, path.join(__basedir, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  }
});

export const readDataFromCsvFile = <DataT>({
  filePath
}: {
  filePath: PathLike;
}) => {
  const csvData: Array<DataT> = [];

  return new Promise<Array<DataT>>((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (data: DataT) => {
        csvData.push(data);
      })
      .on("end", () => resolve(csvData));
  });
};
