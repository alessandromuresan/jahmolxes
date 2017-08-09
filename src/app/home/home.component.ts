import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
    templateUrl: 'home.component.html'
})
export class HomeComponent {

    public title: string;
    public paragraphs: string[];
    public subtext: string;
    public backgroundUrl: string;

    private _appService: AppService;

    constructor(appService: AppService) {

        this._appService = appService;

        this.title = 'Jahmolxes';
        this.paragraphs = [
            `Aperiri constituam ex mea. Ut usu nisl offendit definitiones.
            Voluptatum neglegentur at mei, fabulas commune delicata te sit.
            Eu suas nominavi est, nam agam conclusionemque at.
            Quem delenit periculis ad his.
            Cum cu dolor adolescens, eum et regione propriae facilisis.`
        ];
        this.subtext = 'Exodus 4:20, Jahmolxes';
        this.backgroundUrl = this._appService.getDefaultBackgroundUrl();
    }
}
