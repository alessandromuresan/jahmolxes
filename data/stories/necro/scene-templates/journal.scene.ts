import { Game } from '../../../../src/models/game.model';
import { ParagraphTextStyle } from '../../../../src/models/game-scene.model';

export default function journalScene(game: Game, startingSceneId: string, backSceneId: string, backgroundImage: string, journalParagraphs: string[][]) {

    const nextIdentifier = "next";
    const nextParagraph = `→ {{${nextIdentifier}}}`;
    const backIdentifier = "back";
    const backParagraph = `← {{${backIdentifier}}}`;
    const exitIdentifier = "exit";
    const exitParagraph = `⤬ {{${exitIdentifier}}}`;

    for (let i = 0; i < journalParagraphs.length; i++) {

        const paragraphs = journalParagraphs[i];

        const currentSceneId = i === 0
            ? startingSceneId
            : `${startingSceneId}_${i}`;

        const previousSceneId = i === 0
            ? backSceneId
            :  (i === 1 ? startingSceneId : `${startingSceneId}_${i - 1}`);

        const nextSceneId = i === journalParagraphs.length - 1
            ? null
            : `${startingSceneId}_${i + 1}`;

        console.log({
            currentSceneId,
            previousSceneId,
            nextSceneId
        })

        const currentScene = game.addScene(currentSceneId)
            .withBackgroundImage(backgroundImage)
            .withParagraphs(paragraphs, undefined, state => {
                return {
                    textStyle: ParagraphTextStyle.italic
                }
            })
            

        if (nextSceneId !== null) {

            currentScene
                .withParagraphs([nextParagraph], undefined, state => {
                    return {
                        textStyle: ParagraphTextStyle.default
                    }
                })
                .withLink(nextIdentifier, nextSceneId)
        }

        currentScene
            .withParagraphs([backParagraph], undefined, state => {
                return {
                    textStyle: ParagraphTextStyle.default
                }
            })
            .withLink(backIdentifier, previousSceneId);

        if (i !== 0) {

            currentScene
                .withParagraphs([exitParagraph], undefined, state => {
                    return {
                        textStyle: ParagraphTextStyle.default
                    }
                })
                .withLink(exitIdentifier, backSceneId);
        }
    }
}

export interface IJournalPage {
    paragraphs: string[];
    sceneId: string;
}