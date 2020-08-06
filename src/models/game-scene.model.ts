import { IGameState } from './game.model';
import { Dispatcher } from './dispatcher.model';

export interface IParagraphMetadata {
    text: string;
    condition?: (gameState?: IGameState) => boolean;
}

export interface IIdentifierMetadata {
    identifier: string;
    text?: string;
    icon?: string;
    linkedSceneId?: string;
    onSelectHandler?: (gameState: IGameState, dispatcher: Dispatcher) => void;
    condition?: (gameState?: IGameState) => boolean;
}

export class GameScene {

    public id: string;
    public paragraphs: IParagraphMetadata[];
    public identifiersMetadata: IIdentifierMetadata[];
    public backgroundImage: string;
    public onInitHandler: (gameState?: IGameState) => void;
    private _dispatcher: Dispatcher;

    private _options: IGameSceneOptions;

    constructor(id: string, options: IGameSceneOptions, dispatcher: Dispatcher) {
        this.id = id;
        this.paragraphs = [];
        this.identifiersMetadata = [];
        this._options = options;
        this._dispatcher = dispatcher;
    }

    public onInit(handler: (gameState?: IGameState) => void): GameScene {

        this.onInitHandler = handler;

        return this;
    }

    public configureParagraphs(configAction: (config: ParagraphsConfigurator) => void): GameScene {

        configAction(new ParagraphsConfigurator(this));

        return this;
    }

    public configureIdentifiers(configAction: (config: IdentifiersConfigurator) => void): GameScene {

        configAction(new IdentifiersConfigurator(this));

        return this;
    } 

    public configureIdentifier(identifier: string, configAction: (config: IdentifierConfigurator) => void): GameScene {

        configAction(new IdentifierConfigurator(identifier, this));

        return this;
    }

    public withParagraphs(paragraphs: string[], condition?: (state: IGameState) => boolean): GameScene {

        let paragraphsConfig = new ParagraphsConfigurator(this);

        paragraphs.forEach(paragraph => {
            paragraphsConfig.add(paragraph, condition);
        });

        return this;
    }

    public withLink(identifier: string, sceneId: string, condition?: (state: IGameState) => boolean): GameScene {

        let identifierConfig = new IdentifierConfigurator(identifier, this);

        identifierConfig.linkScene(sceneId, condition);

        return this;
    }

    public withBackButton(text?: string): GameScene {

        let backIdentifier = '$back';
        let backText = text || this._options.defaultBackText;

        let paragraphsConfig = new ParagraphsConfigurator(this);
        let identifierConfig = new IdentifierConfigurator(backIdentifier, this);

        paragraphsConfig.add(`{{${backIdentifier}}}`);
        identifierConfig.text(backText);

        return this;
    }

    public withBackgroundImage(backgroundImage: string): GameScene {

        this.backgroundImage = backgroundImage;

        return this;
    }

    public handleSelect(identifier: string, gameState: IGameState): void {

        let metadata = this.getIdentifierMetadata(identifier, gameState);

        if (!metadata) {
            return;
        }

        if (typeof metadata.onSelectHandler === 'function') {
            metadata.onSelectHandler(gameState, this._dispatcher);
        }
    }

    public getParagraphs(gameState: IGameState): string[] {
        return this.paragraphs
            .filter(p => !p.condition || p.condition(gameState))
            .map(p => p.text);
    }

    public getLinkedSceneIds(): string[] {
        return this.identifiersMetadata
            .filter(i => i.linkedSceneId)
            .map(i => i.linkedSceneId);
    }

    public getLinkedSceneId(identifier: string, gameState: IGameState): string {

        let metadata = this.getIdentifierMetadata(identifier, gameState);

        if (!metadata) {
            return null;
        }

        return metadata.linkedSceneId;
    }

    public getIdentifierText(identifier: string, gameState: IGameState): string {  

        let metadata = this.getIdentifierMetadata(identifier, gameState);

        if (!metadata) {
            return identifier;
        }

        return metadata.text || identifier;
    }

    public getIdentifierIcon(identifier: string, gameState: IGameState): string {  

        let metadata = this.getIdentifierMetadata(identifier, gameState);

        if (!metadata) {
            return null;
        }

        return metadata.icon;
    }

    public getIdentifierMetadata(identifier: string, gameState: IGameState): IIdentifierMetadata {

        return this.identifiersMetadata.filter(i => i.identifier === identifier && (!i.condition || i.condition(gameState)))[0];
    }
}

export class ParagraphsConfigurator {

    private _scene: GameScene;

    constructor(scene: GameScene) {
        this._scene = scene;
    }

    public add(paragraph: string | string[], condition?: (gameState: IGameState) => boolean): ParagraphsConfigurator {

        if (paragraph instanceof Array) {
            paragraph.forEach(p => {
                this._scene.paragraphs.push({
                    text: p,
                    condition: condition
                });
            })
        } else {
            this._scene.paragraphs.push({
                text: paragraph,
                condition: condition
            });
        }

        return this;
    }
}

export class IdentifiersConfigurator {

    private _scene: GameScene;

    constructor(scene: GameScene) {
        this._scene = scene;
    }

    public for(identifier: string): IdentifierConfigurator {
        return new IdentifierConfigurator(identifier, this._scene);
    }
}

export class IdentifierConfigurator {

    private _identifier: string;
    private _scene: GameScene;
    private _metadata: IIdentifierMetadata;

    constructor(identifier: string, scene: GameScene) {

        this._scene = scene;

        this._metadata = {
            identifier: identifier
        };

        this._scene.identifiersMetadata.push(this._metadata);
    }

    public text(text: string): IdentifierConfigurator {

        this._metadata.text = text;

        return this;
    }

    public icon(icon: string): IdentifierConfigurator {

        this._metadata.icon = icon;

        return this;
    }

    public linkScene(sceneId: string, condition?: (state: IGameState) => boolean): IdentifierConfigurator {

        this._metadata.linkedSceneId = sceneId;
        this._metadata.condition = condition;

        return this;
    }

    public onselect(handler: (gameState: IGameState, dispatcher: Dispatcher) => void): IdentifierConfigurator {

        this._metadata.onSelectHandler = handler;

        return this;
    }
}

export interface IGameSceneOptions {
    defaultBackText: string;
}
