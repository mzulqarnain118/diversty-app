import csv from 'csv-parser';
import { Readable } from 'stream';

export async function getEmailFromFile(data: File){
    try{
        return await parseCSV(data);
    }catch(e){
        console.log(e);
        return []
    }
}

async function parseCSV(csvData: File) {
  const buffer = await csvData.arrayBuffer();
  return new Promise<string[]>((resolve, reject) => {
    const emails: string[] = [];

    if (!csvData) {
      return resolve([]);
    }

    const readable = new Readable();
    readable.push(Buffer.from(buffer));
    readable.push(null);

    readable
      .pipe(csv())
      .on('data', (row) => {
        // Check if the "email" column exists in the row
        if (row.hasOwnProperty('email')) {
          emails.push(row['email']);
        }
      })
      .on('end', () => {
        resolve(emails);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}