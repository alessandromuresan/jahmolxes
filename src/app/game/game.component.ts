import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AppService } from '../../services/app.service';

import { Game } from '../../models/game.model';

@Component({
    templateUrl: 'game.component.html'
})
export class GameComponent {

    public backgroundUrl: string;
    public introTitle: string;
    public introParagraphs: string[];
    public paragraphs: any;
    public gameStarted: boolean;
    public exitInProgress: boolean;

    public exitText: string;
    public cancelExitText: string;
    public confirmExitText: string;

    private _game: Game;

    private _appService: AppService;
    private _gameService: GameService;

    constructor(appService: AppService, gameService: GameService) {

        this._appService = appService;
        this._gameService = gameService;

        this.introTitle = '';
        this.introParagraphs = [
            'Journey into the teachings of Jahmolxes...'
        ];
        this.exitText = 'Are you sure you want to abandon your journey now?';
        this.cancelExitText = 'Stay';
        this.confirmExitText = 'Leave';

        this.backgroundUrl = this._appService.getDefaultBackgroundUrl();

        this._game = this._gameService.loadGame();

        this._game.start();

        this.renderScene();

        if (!this._game.isNewGame()) {
            this.gameStarted = true;
        }
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

        this.gameStarted = true;
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
        return this._game.getCurrentScene().getIdentifierText(identifier);
    }

    public renderScene(): void {

        let sceneParagraphs = this._game.getCurrentScene().paragraphs;

        let paragraphs = [];

        sceneParagraphs.forEach(paragraph => {
            paragraphs.push(paragraph.split(' '));
        });

        this.paragraphs = paragraphs;
    }
}
