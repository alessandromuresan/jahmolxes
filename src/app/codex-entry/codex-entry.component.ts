import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import  { ICodexEntry } from '../../models/codex-entry.model';
import { CodexService } from '../../services/codex.service';

@Component({
    selector: 'codex-entry',
    templateUrl: 'codex-entry.component.html'
})
export class CodexEntryComponent {

    public entry: ICodexEntry;

    private _slug;
    private _sub: any;

    private _route: ActivatedRoute;
    private _codexService: CodexService;

    private _defaultBackgroundUrl: string = 'assets/img/intro-bg.jpg';

    constructor(codexService: CodexService, route: ActivatedRoute) {

        this._codexService = codexService;
        this._route = route;
    }

    ngOnInit() {
        this._sub = this._route.params.subscribe(params => {
            this._slug = params['slug'];
            this.entry = this._codexService.getCodexEntry(this._slug);
        });
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }

    public getBackgroundStyle(): string {

        let backgroundUrl = this.entry && this.entry.backgroundUrl
            ? this.entry.backgroundUrl
            : this._defaultBackgroundUrl;

        return `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url('${backgroundUrl}') no-repeat/cover bottom center scroll)`;
    }
}
