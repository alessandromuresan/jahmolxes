import { Game, IGameState } from '../../../../src/models/game.model';

export interface IMultipleChoiceItem {
    id: string;
    text: string;
}

export interface IMultipleChoiceSceneOptions {

    sceneId: string;
    backgroundUrl: string;
    condition?: (state: IGameState) => boolean;
    firstViewParagraphs: string[];
    firstViewChoices: IMultipleChoiceItem[];
}

export default function multipleChoiceScene(game: Game, options: IMultipleChoiceSceneOptions) {

    game.addScene(options.sceneId)
        .withBackgroundImage(options.backgroundUrl)
        .withParagraphs(options.firstViewParagraphs);

    
}
