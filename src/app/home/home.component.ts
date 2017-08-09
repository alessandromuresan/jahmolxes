import { Component } from '@angular/core';

@Component({
    templateUrl: 'home.component.html'
})
export class HomeComponent {

    public title: string;
    public paragraphs: string[];
    public subtext: string;
    public backgroundUrl: string;

    constructor() {

        this.title = 'Jahmolxes';
        this.subtext = 'Exodus 4:20, Jahmolxes';
        this.backgroundUrl = 'assets/img/intro-bg.jpg';
        this.paragraphs = [
            `Aperiri constituam ex mea. Ut usu nisl offendit definitiones.
            Voluptatum neglegentur at mei, fabulas commune delicata te sit.
            Eu suas nominavi est, nam agam conclusionemque at.
            Quem delenit periculis ad his.
            Cum cu dolor adolescens, eum et regione propriae facilisis.`
        ];
    }
}
