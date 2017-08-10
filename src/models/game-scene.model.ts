import { IGameState } from './game.model';

export interface IParagraphMetadata {
    text: string;
    condition?: (gameState?: IGameState) => boolean;
}

export interface IIdentifierMetadata {
    identifier: string;
    text?: string;
    icon?: string;
    linkedSceneId?: string;
    onSelectHandler?: (gameState?: IGameState) => void;
}

export class GameScene {

    public id: string;
    public paragraphs: IParagraphMetadata[];
    public identifiersMetadata: IIdentifierMetadata[];

    private _onInitHandler: (gameState?: IGameState) => void;

    constructor(id: string) {
        this.id = id;
        this.paragraphs = [];
        this.identifiersMetadata = [];
    }

    public onInit(handler: (gameState?: IGameState) => void): GameScene {

        this._onInitHandler = handler;

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

    public handleSelect(identifier: string, gameState: IGameState): void {

        let metadata = this.getIdentifierMetadata(identifier);

        if (!metadata) {
            return;
        }

        if (typeof metadata.onSelectHandler === 'function') {
            metadata.onSelectHandler(gameState);
        }
    }

    public getParagraphs(gameState: IGameState): string[] {
        return this.paragraphs
            .filter(p => !p.condition || p.condition(gameState))
            .map(p => p.text);
    }

    public getLinkedSceneId(identifier: string): string {

        let metadata = this.getIdentifierMetadata(identifier);

        if (!metadata) {
            return null;
        }

        return metadata.linkedSceneId;
    }

    public getIdentifierText(identifier: string): string {  

        let metadata = this.getIdentifierMetadata(identifier);

        if (!metadata) {
            return identifier;
        }

        return metadata.text || identifier;
    }

    public getIdentifierIcon(identifier: string): string {  

        let metadata = this.getIdentifierMetadata(identifier);

        if (!metadata) {
            return null;
        }

        return metadata.icon;
    }

    public getIdentifierMetadata(identifier: string): IIdentifierMetadata {
        return this.identifiersMetadata.filter(i => i.identifier === identifier)[0];
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

        this._metadata = this._scene.identifiersMetadata.filter(i => i.identifier === identifier)[0];

        if (!this._metadata) {

            this._metadata = {
                identifier: identifier
            };

            this._scene.identifiersMetadata.push(this._metadata);
        }
    }

    public text(text: string): IdentifierConfigurator {

        this._metadata.text = text;

        return this;
    }

    public icon(icon: string): IdentifierConfigurator {

        this._metadata.icon = icon;

        return this;
    }

    public linkScene(sceneId: string): IdentifierConfigurator {

        this._metadata.linkedSceneId = sceneId;

        return this;
    }

    public onselect(handler: (gameState?: IGameState) => void): IdentifierConfigurator {

        this._metadata.onSelectHandler = handler;

        return this;
    }
}
