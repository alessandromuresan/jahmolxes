import { Component, Input } from '@angular/core';
import  { ICodexEntry } from '../../models/codex-entry.model';
import { CodexService } from '../../services/codex.service';
import { AppService } from '../../services/app.service';

@Component({
    templateUrl: 'codex.component.html'
})
export class CodexComponent {

    public title: string;
    public backgroundUrl: string;
    public codexEntries: ICodexEntry[];

    private _appService: AppService;
    private _codexService: CodexService;

    constructor(appService: AppService, codexService: CodexService) {

        this._appService = appService;
        this._codexService = codexService;
        
        this.title = 'Codex';
        this.backgroundUrl = this._appService.getDefaultBackgroundUrl();
        this.codexEntries = this._codexService.getCodexEntries();
    }
}
