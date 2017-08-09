import { Injectable } from '@angular/core';

const ls = require('local-storage');

@Injectable()
export class StorageService {

    constructor() {

    }

    public get<T>(key: string): T {

        let value = ls.get(key);

        if (!value) {
            return value;
        }

        let deserializedValue = null;

        try {
            deserializedValue = JSON.parse(value);
        } catch(e) {
            return value;
        }

        return (<T>deserializedValue);
    }

    public set(key: string, value: any): boolean {

        let serializedValue = value;

        if (serializedValue) {
            serializedValue = typeof serializedValue === 'object'
                ? JSON.stringify(serializedValue)
                : serializedValue.toString();
        }

        return ls.set(key, serializedValue);
    }

    public remove(key: string): boolean {
        return ls.remove(key);
    }
}