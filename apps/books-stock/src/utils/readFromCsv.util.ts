import fs, { PathLike } from 'fs';
import * as csv from 'fast-csv';

export const readDataFromCsvFile = <DataT>({
  filePath
}: {
  filePath: PathLike;
}) => {
  const csvData: Array<DataT> = [];

  return new Promise<Array<DataT>>((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => {
        throw error.message;
      })
      .on('data', (data: DataT) => {
        csvData.push(data);
      })
      .on('end', () => resolve(csvData));
  });
};
