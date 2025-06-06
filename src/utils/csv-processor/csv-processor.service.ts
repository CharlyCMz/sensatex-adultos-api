import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { CreateLocationDTO } from 'src/users/dtos/location.dto';

@Injectable()
export class CsvProcessorService {
  loadDictionary(dictionaryName: string): Record<string, string> {
    const dictionaryPath = path.join(
      __dirname,
      './dictionaries/',
      `${dictionaryName}.dictionary.json`,
    );
    if (!fs.existsSync(dictionaryPath)) {
      throw new Error(`El diccionario ${dictionaryName} no existe.`);
    }
    const data = fs.readFileSync(dictionaryPath, 'utf-8');
    return JSON.parse(data) as Record<string, string>;
  }

  renameHeaders(
    row: Record<string, any>,
    dictionary: Record<string, any>,
  ): Record<string, any> {
    const renamedRow: Record<string, any> = {};

    const normalizedDictionary: Record<string, any> = {};
    for (const key of Object.keys(dictionary)) {
      normalizedDictionary[key.toLowerCase().trim()] = dictionary[key];
    }

    for (const header of Object.keys(row)) {
      const normalizedHeader = header.toLowerCase().trim();
      const newHeader = normalizedDictionary[normalizedHeader] || header;
      renamedRow[newHeader] = row[header];
    }

    return renamedRow;
  }

  processCsvBuffer(buffer: Buffer, dictionaryName: string): Promise<any[]> {
    const stream = Readable.from(buffer);
    const records: any[] = [];
    const dictionary = this.loadDictionary(dictionaryName);
    return new Promise((resolve, reject) => {
      stream
        .pipe(
          parse({
            columns: true,
            delimiter: ';',
            skipRecordsWithEmptyValues: true,
            trim: true,
          }),
        )
        .on('data', (row) => {
          const renamedRow = this.renameHeaders(row, dictionary);
          let transformedRow;
          switch (dictionaryName) {
            // case 'product':
            //   transformedRow = this.transformRowToProduct(renamedRow);
            //   break;
            case 'location':
              transformedRow = this.transformRowToLocation(renamedRow);
              break;
          }
          records.push(transformedRow);
        })
        .on('error', function (error) {
          //console.log(error);
          reject(error);
        })
        .on('end', function () {
          resolve(records);
        });
    });
  }

  transformRowToLocation(row): CreateLocationDTO {
    return {
      cityCode: String(row.cityCode),
      cityName: String(row.city),
      stateCode: String(row.stateCode),
      stateName: String(row.state),
      countryCode: String(row.countryCode),
      countryName: String(row.country),
    };
  }
}
