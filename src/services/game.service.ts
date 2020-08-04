import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Game, IGameState } from '../models/game.model';
import { visions } from '../../data/stories/visions';
import { oceanus } from '../../data/stories/oceanus';
import { necro } from '../../data/stories/necro';

@Injectable()
export class GameService {

    private _gameStateKey = 'JAHMOLXES_GAME_STATE';

    private _storageService: StorageService;

    constructor(storageService: StorageService) {
        this._storageService = storageService;
    }

    public loadGame(storyName: string): Game {

        let game = new Game();

        let story = this.getStoryConfigurer(storyName);

        story(game);

        let gameState = this._storageService.get<IGameState>(this.getStoryStateKey(storyName));

        if (gameState) {
            if (typeof gameState === 'object') {
                game.load(gameState);
            } else {
                console.warn(`Trying to load invalid game state:`);
                console.warn(gameState);
            }
        }

        return game;
    }

    private getStoryStateKey(storyName: string): string {
        return `${this._gameStateKey}_${storyName}`;
    }

    private getStoryConfigurer(storyName: string): (game: Game) => void {

        console.log(`getStoryConfigurer ${storyName}`)

        switch(storyName) {
            case "visions": {
                return visions;
            }
            case "oceanus": {
                return oceanus;
            }
            case "necro": {
                return necro;
            }
        }
    }

    public saveGame(game: Game): void {

        let gameState = game.getState();

        this._storageService.set(this._gameStateKey, gameState);
    }

    public clearSaves(): void {
        this._storageService.remove(this._gameStateKey);
    }
}
