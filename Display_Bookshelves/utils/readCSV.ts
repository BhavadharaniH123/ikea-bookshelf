import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export function readCSVData() {
    const absolutePath = path.resolve(__dirname, '..', 'data', 'testdata.csv');
    console.log('Resolved path:', absolutePath); // Optional: for debugging
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return parse(fileContent, {
    columns: header => header.map(h => h.trim().toLowerCase()),
    skip_empty_lines: true,
    trim: true,
});
}
