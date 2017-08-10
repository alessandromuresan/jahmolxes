import { GameScene } from './game-scene.model';

export interface IGameState {
    sceneId: string;
    previousSceneId: string;
    data: any;
}

export class Game {

    private _scenes: GameScene[];
    private _currentScene: GameScene;
    private _state: IGameState;
    private _startingSceneId: string;
    private _identifierPattern: string;
    private _identifierNamePattern: string;
    private _isNewGame: boolean = true;

    constructor() {
        this._scenes = [];
        this._currentScene = null;
        this._state = {
            sceneId: null,
            previousSceneId: null,
            data: {}
        };

        this._identifierPattern = '({{\\${0,1}\\w+}})';
        this._identifierNamePattern = '{{(\\${0,1}\\w+)}}';
    }

    public start(): void {

        let currentSceneId = this._state.sceneId || this._startingSceneId;

        if (!currentSceneId) {
            throw new Error('Please call Game.setStartingScene before calling Game.start');
        }

        this._currentScene = this._scenes.filter(s => s.id === currentSceneId)[0];

        if (!this._currentScene) {
            throw new Error(`Starting scene invalid. No scene with id ${currentSceneId} found`);
        }

        this._state.sceneId = currentSceneId;
        this._state.previousSceneId = this._state.previousSceneId || currentSceneId;
    }

    public load(gameState: IGameState): void {
        this._state = gameState;
        this._isNewGame = false;
    }

    public isNewGame(): boolean {
        return this._isNewGame;
    }

    public getState(): IGameState {
        return this._state;
    }

    public setStartingScene(id: string): Game {

        this._startingSceneId = id;

        return this;
    }

    public addScene(id: string): GameScene {

        let scene = new GameScene(id);

        this._scenes.push(scene);

        return scene;
    }

    public handleIdentifierClick(identifier: string): void {

        let nextSceneId: string;

        switch (identifier) {
            case '$back': {
                nextSceneId = this._state.previousSceneId;
                break;
            }
            default: {
                nextSceneId = this._currentScene.getLinkedSceneId(identifier);
                break;
            }
        }

        this._currentScene.handleSelect(identifier, this.getState());

        if (nextSceneId) {

            this._state.previousSceneId = this._state.sceneId;
            this._state.sceneId = nextSceneId;

            this._currentScene = this._scenes.filter(s => s.id === nextSceneId)[0];
        }
    }

    public getCurrentScene(): GameScene {
        return this._currentScene;
    }

    public isIdentifier(word: string): boolean {
        return (new RegExp(this._identifierNamePattern, 'g')).test(word);
    }

    public extractIdentifier(word: string): string {
        return word.replace(new RegExp(this._identifierNamePattern, 'g'), '$1');
    }

    public extractParagraphComponents(paragraph: string): string[] {

        let initialComponents = paragraph.split(' ');

        let components = [];

        initialComponents.forEach(component => {

            let regex = new RegExp(this._identifierPattern, 'g');

            if (regex.test(component)) {

                let matches = component.match(regex);

                // there can't be more than one match per component, because we don't allow spaces in identifiers
                let match = matches[0];

                if (match === component) {
                    components.push(component);
                } else {

                    let indexOfMatch = component.indexOf(match);

                    let beforeMatch = component.slice(0, indexOfMatch);
                    let afterMatch = component.slice(indexOfMatch + match.length, component.length);

                    if (beforeMatch) {
                        components.push(beforeMatch);
                    }

                    components.push(match);

                    if (afterMatch) {
                        components.push(afterMatch);
                    }
                }

            } else {
                components.push(component);
            }
        });

        return components;
    }
}
