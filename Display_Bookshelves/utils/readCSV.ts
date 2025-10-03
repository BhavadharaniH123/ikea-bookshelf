import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export function readCSVData(filePath: string) {
    const absolutePath = path.resolve(__dirname, '..', filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
}
