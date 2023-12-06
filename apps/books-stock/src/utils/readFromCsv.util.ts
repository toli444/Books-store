import fs, { PathLike } from 'fs';
import * as csv from 'fast-csv';

export const readDataFromCsvFile = <DataT>({
  filePath,
  parseData = (f) => f as DataT
}: {
  filePath: PathLike;
  parseData?: (f: object) => DataT;
}) => {
  const csvData: Array<DataT> = [];

  return new Promise<Array<DataT>>((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => {
        throw error.message;
      })
      .on('data', (data: object) => {
        csvData.push(parseData(data));
      })
      .on('end', () => resolve(csvData));
  });
};
