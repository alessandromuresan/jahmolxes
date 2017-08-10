import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Game, IGameState } from '../models/game.model';
import { configureGame } from '../../data/game';

@Injectable()
export class GameService {

    private _gameStateKey = 'JAHMOLXES_GAME_STATE';

    private _storageService: StorageService;

    constructor(storageService: StorageService) {
        this._storageService = storageService;
    }

    public loadGame(): Game {

        let game = new Game();

        configureGame(game);

        let gameState = this._storageService.get<IGameState>(this._gameStateKey);

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

    public saveGame(game: Game): void {

        let gameState = game.getState();

        this._storageService.set(this._gameStateKey, gameState);
    }

    public clearSaves(): void {
        this._storageService.remove(this._gameStateKey);
    }
}
