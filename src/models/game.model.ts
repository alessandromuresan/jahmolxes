export class Game {

    private _scenes: GameScene[];
    private _currentScene: GameScene;
    private _state: IGameState;
    private _startingSceneId: string;
    private _identifierPattern: string;
    private _isNewGame: boolean = true;

    constructor() {
        this._scenes = [];
        this._currentScene = null;
        this._state = {
            sceneId: null,
            previousSceneId: null
        };

        this._identifierPattern = '{{(\\${0,1}\\w+)}}';
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

    public reset(): void {
        this._state = {
            sceneId: null,
            previousSceneId: null
        };
        this._isNewGame = true;
        this._currentScene = this._scenes.filter(s => s.id === this._startingSceneId)[0];
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
        return (new RegExp(this._identifierPattern, 'g')).test(word);
    }

    public extractIdentifier(word: string): string {
        return word.replace(new RegExp(this._identifierPattern, 'g'), '$1');
    }
}

export interface IGameState {
    sceneId: string;
    previousSceneId: string;
}

export interface ISceneLink {
    identifier: string;
    sceneId: string;
}

export class GameScene {

    public id: string;
    public paragraphs: string[];
    public sceneLinks: ISceneLink[];
    public identifierTexts: { [identifier: string]: string };

    private _onInitHandler: (gameState?: IGameState) => void;
    private _onSelectHandlers: { [key: string]: (gameState?: IGameState) => void };

    constructor(id: string) {
        this.id = id;
        this.paragraphs = [];
        this.sceneLinks = [];
        this.identifierTexts = {};
        this._onSelectHandlers = {};
    }

    public onInit(handler: (gameState?: IGameState) => void): GameScene {

        this._onInitHandler = handler;

        return this;
    }

    public hasParagraphs(paragraphs: string[]): GameScene {

        this.paragraphs = paragraphs.slice();

        return this;
    }

    public onSelect(identifier: string, handler: (gameState?: IGameState) => void): GameScene {

        this._onSelectHandlers[identifier] = handler;

        return this;
    }

    public handleSelect(identifier: string, gameState: IGameState): void {

        let handler = this._onSelectHandlers[identifier];

        if (typeof handler === 'function') {
            handler(gameState);
        }
    }

    public linkScene(identifier: string, sceneId: string): GameScene {

        this.sceneLinks.push({
            identifier: identifier,
            sceneId: sceneId
        });

        return this;
    }

    public getLinkedSceneId(identifier: string): string {

        let sceneLink = this.sceneLinks.filter(l => l.identifier === identifier)[0];

        if (sceneLink) {
            return sceneLink.sceneId;
        }

        return null;
    }

    public setIdentifierText(identifier: string, text: string): GameScene {

        this.identifierTexts[identifier] = text;

        return this;
    }

    public getIdentifierText(identifier: string): string {  
        return this.identifierTexts[identifier] || identifier;
    }
}
