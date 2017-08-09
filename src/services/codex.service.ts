import { Injectable } from '@angular/core';
import { ICodexEntry } from '../models/codex-entry.model';

const codexEntries: ICodexEntry[] = require('../../data/codex.json');

@Injectable()
export class CodexService {

    constructor() {

    }

    public getCodexEntries(): ICodexEntry[] {
        return codexEntries;
    }

    public getCodexEntry(slug: string): ICodexEntry {
        return codexEntries.filter(e => e.slug === slug)[0];
    }
}