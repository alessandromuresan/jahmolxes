import { Component, Input } from '@angular/core';
import  { ICodexEntry } from '../../models/codex-entry.model';
import { CodexService } from '../../services/codex.service';

@Component({
    templateUrl: 'codex.component.html'
})
export class CodexComponent {

    public title: string;
    public backgroundUrl: string;
    public codexEntries: ICodexEntry[];

    private _codexService: CodexService;

    constructor(codexService: CodexService) {

        this._codexService = codexService;
        
        this.title = 'Codex';
        this.backgroundUrl = 'assets/img/intro-bg.jpg';
        this.codexEntries = this._codexService.getCodexEntries();
    }
}
