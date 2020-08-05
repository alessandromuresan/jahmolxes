import { GameScene } from './game-scene.model';
import { Howl } from 'howler';
import { Dispatcher, GameCommand } from './dispatcher.model';

export interface IGameState {
    sceneId: string;
    previousSceneId: string;
    getStringVariable(name: string): string;
    setStringVariable(name: string, value: string): void;
    getBooleanVariable(name: string): boolean;
    setBooleanVariable(name: string, value: boolean): void;
    getNumberVariable(name: string): number;
    setNumberVariable(name: string, value: number): void;
}

export type OnSceneChangeHandler = (scene: IReadonlyScene) => void;

export class Game {

    private _scenes: GameScene[];
    private _currentScene: GameScene;
    private _state: IGameState;
    private _stringVariables: { [key: string]: string } = {};
    private _booleanVariables: { [key: string]: boolean } = {};
    private _numberVariables: { [key: string]: number } = {};
    private _startingSceneId: string;
    private _identifierPattern: string;
    private _identifierNamePattern: string;
    private _isNewGame: boolean = true;
    private _navigatedSceneIds: string[];
    private _onSceneChangeHandler: OnSceneChangeHandler;
    private _dispatcher: Dispatcher;
    
    public backgroundUrl: string;
    public introTitle: string;
    public introParagraphs: string[];
    public exitText: string;
    public beginText: string;
    public backText: string;
    public backgroundSoundSrc: string;
    public loadingText: string;

    constructor() {
        this._scenes = [];
        this._currentScene = null;
        this._state = {
            sceneId: null,
            previousSceneId: null,
            getStringVariable: (name) => {
                return this._stringVariables[name];
            },
            setStringVariable: (name, value) => {
                this._stringVariables[name] = value;
            },
            getBooleanVariable: (name) => {
                return this._booleanVariables[name];
            },
            setBooleanVariable: (name, value) => {
                this._booleanVariables[name] = value;
            },
            getNumberVariable: (name) => {
                return this._numberVariables[name];
            },
            setNumberVariable: (name, value) => {
                this._numberVariables[name] = value;
            }
        };

        this._navigatedSceneIds = [];

        this._identifierPattern = '({{\\w*}})';
        this._identifierNamePattern = '{{(\\w*)}}';

        this._dispatcher = new Dispatcher();

        this._dispatcher.on(GameCommand.playSound, (payload) => {
            console.log(`command ${GameCommand.playSound}`);

            this.playSound(payload.src);
        })
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

        this.playSound(this.backgroundSoundSrc);
    }

    public onSceneChange(handler: OnSceneChangeHandler): void {

        this._onSceneChangeHandler = handler;
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

        let scene = new GameScene(id, {
            defaultBackText: this.backText || '. .'
        }, this._dispatcher);

        this._scenes.push(scene);

        return scene;
    }

    public handleIdentifierClick(identifier: string): void {

        let nextSceneId: string;

        switch (identifier) {
            case '$back': {
                nextSceneId = this.getPreviousSceneId(this._currentScene.id);
                break;
            }
            default: {
                nextSceneId = this._currentScene.getLinkedSceneId(identifier, this._state);
                break;
            }
        }

        this._currentScene.handleSelect(identifier, this.getState());

        if (nextSceneId) {

            this._state.previousSceneId = this._state.sceneId;
            this._state.sceneId = nextSceneId;

            this._currentScene = this._scenes.filter(s => s.id === nextSceneId)[0];

            this.handleCurrentScene();
        } else {
            throw new Error("Next scene cannot be empty");
        }
    }

    private handleCurrentScene() {

        if (this._onSceneChangeHandler) {
            this._onSceneChangeHandler({
                backgroundImage: this._currentScene.backgroundImage,
                id: this._currentScene.id
            });
        }

        if (this._currentScene.onInitHandler) {
            this._currentScene.onInitHandler(this._state);
        }

        console.log(this._stringVariables);
        console.log(this._numberVariables);
        console.log(this._booleanVariables);
    }

    private getPreviousSceneId(sceneId: string): string {

        let previousSceneId: string;

        let sceneIds: string[] = [];

        sceneIds.push(this._startingSceneId);

        while (sceneIds.length !== 0) {

            let currentSceneId = sceneIds.pop();
            let currentScene = this.getSceneById(currentSceneId);

            let linkedSceneIds = currentScene.getLinkedSceneIds();

            if (linkedSceneIds.some(id => id === sceneId)) {
                return currentScene.id;
            }

            linkedSceneIds.forEach(id => {
                sceneIds.push(id);
            });
        }

        return null;
    }

    private getSceneById(id: string): GameScene {
        return this._scenes.filter(s => s.id === id)[0];
    }

    private pushNavigatedSceneId(id: string): void {
        this._navigatedSceneIds.push(id);
    }

    private popNavigatedSceneId(): string {
        return this._navigatedSceneIds.pop();
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

    private playSound(src: string, loop?: boolean): void {

        const sound = new Howl({
            src: [src],
            autoplay: true,
            loop: loop,
            volume: 0.5,
            onend: function() {
                console.log(`finished playing ${src}`);
            }
        });

        sound.play();
    }
}

export interface IReadonlyScene {
    backgroundImage: string;
    id: string;
}
