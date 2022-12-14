import fs from 'fs';

export type ReadFileCallback = (data: string) => void;

export const readFile = (path: string, callback: ReadFileCallback) => fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    }
    callback(data);
})

export const readInput = (data: string): string[] => {
    const lines = data.split('\n')
    return lines;
}

export const asyncReadFiles = (path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data)
        });
    });
}