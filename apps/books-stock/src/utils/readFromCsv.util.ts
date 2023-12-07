import fs, { PathLike } from 'fs';
import * as csv from 'fast-csv';

export function readDataFromCsvFile<DataT extends object>(
  filePath: PathLike,
  parseData: (f: Record<keyof DataT, string>) => DataT
) {
  const csvData: Array<DataT> = [];

  return new Promise<Array<DataT>>((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => {
        throw error.message;
      })
      .on('data', (data: Record<keyof DataT, string>) => {
        csvData.push(parseData(data));
      })
      .on('end', () => resolve(csvData));
  });
}
