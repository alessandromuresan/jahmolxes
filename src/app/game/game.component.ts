import { Component, Input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AppService } from '../../services/app.service';

import { Game } from '../../models/game.model';
import { ActivatedRoute } from '@angular/router';
import { CodexService } from '../../services/codex.service';
import { ICodexEntry } from '../../models/codex-entry.model';

@Component({
    templateUrl: 'game.component.html'
})
export class GameComponent {

    private _slug;
    private _sub: any;

    private _route: ActivatedRoute;
    private _codexService: CodexService;
    private _loadingSeconds: number = 1000 * 1;

    public backgroundSize: string;
    public backgroundUrl: string;
    public introTitle: string;
    public introParagraphs: string[];
    public paragraphs: any;
    public gameStarted: boolean;
    public exitInProgress: boolean;

    public exitText: string;
    public cancelExitText: string;
    public confirmExitText: string;
    public beginText: string;
    public loadingInProgress: boolean;
    public loadingText: string;

    private _game: Game;

    private _appService: AppService;
    private _gameService: GameService;

    public entry: ICodexEntry;

    constructor(appService: AppService, gameService: GameService, codexService: CodexService, route: ActivatedRoute) {

        this._codexService = codexService;
        this._route = route;
        this._appService = appService;
        this._gameService = gameService;

        this.exitText = 'Are you sure you want to abandon the journey now?';
        this.cancelExitText = 'Stay';
        this.confirmExitText = 'Leave';
        this.backgroundSize = 'cover';
    }

    ngOnInit() {
        this._sub = this._route.params.subscribe(params => {

            this._slug = params['slug'];
            this.entry = this._codexService.getCodexEntry(this._slug);

            this._game = this._gameService.loadGame(this._slug);

            this._game.onSceneChange(scene => {

                console.log('scene changed');

                if (scene.backgroundImage) {
                    this.backgroundUrl = scene.backgroundImage;
                }
            });

            this.backgroundUrl = this._game.backgroundUrl || this._appService.getDefaultBackgroundUrl();

            this.introTitle = this._game.introTitle;
            this.introParagraphs = this._game.introParagraphs;
            this.exitText = this._game.exitText;
            this.beginText = this._game.beginText;
            this.loadingText = this._game.loadingText;

            this._game.start();

            this.renderScene();

            if (!this._game.isNewGame()) {
                this.gameStarted = true;
            }
        });
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }

    public isIdentifier(word: string): boolean {
        return this._game.isIdentifier(word);
    }

    public extractIdentifier(word: string): string {
        return this._game.extractIdentifier(word);
    }

    public onBeginClick(e: Event): void {

        e.preventDefault();

        this._gameService.saveGame(this._game);

        this.loadingInProgress = true;

        setTimeout(() => {

            this.gameStarted = true;

            this.backgroundUrl = this._game.getCurrentScene().backgroundImage;

            this.loadingInProgress = false;

        }, this._loadingSeconds);
    }

    public onExitClick(e: Event): void {

        e.preventDefault();

        this.exitInProgress = true;
    }

    public onCancelExitClick(e: Event): void {

        e.preventDefault();

        this.exitInProgress = false;
    }

    public onConfirmExitClick(e: Event): void {

        e.preventDefault();

        this._gameService.clearSaves();

        window.location.reload();
    }

    public onIdentifierClick(e: Event, identifier: string): void {

        e.preventDefault();

        this._game.handleIdentifierClick(identifier);

        this.renderScene();

        this._gameService.saveGame(this._game);
    }

    public getIdentifierText(identifier: string): string {
        return this._game.getCurrentScene().getIdentifierText(identifier, this._game.getState());
    }

    public renderScene(): void {

        let currentScene = this._game.getCurrentScene();
        let sceneParagraphs = currentScene.getParagraphs(this._game.getState());

        let paragraphs = [];

        sceneParagraphs.forEach(paragraph => {
            // paragraphs.push(paragraph.split(' '));
            paragraphs.push(this._game.extractParagraphComponents(paragraph));
        });

        this.paragraphs = paragraphs;

        // if (currentScene.backgroundImage) {
        //     this.backgroundUrl = currentScene.backgroundImage;
        // }
    }
}
