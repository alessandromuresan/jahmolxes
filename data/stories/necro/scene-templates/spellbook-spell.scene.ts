import { Game } from '../../../../src/models/game.model';
import { ISpell, hasSpellInSpellbook, addSpellToSpellbook, removeSpellFromSpellbook } from '../spells';
import { GameScene, ParagraphAlignStyle } from '../../../../src/models/game-scene.model';

export default function spellbookSpellScene(game: Game, sceneId: string, backSeneId: string, backgroundImage: string, spell: ISpell): GameScene {

    const scene = game.addScene(sceneId);

    const learnSceneId = `${sceneId}_learn`;
    const unlearnSceneId = `${sceneId}_unlearn`;

    const backIdentifier = "back";
    const backParagraphs = [
        `← {{${backIdentifier}}}`
    ];

    scene
        .withBackgroundImage(backgroundImage)
        .withParagraphs([
                `${spell.name}`
            ])
        .withParagraphs(spell.descriptionParagraphs, undefined, state => {
                return {
                    alignStyle: ParagraphAlignStyle.default
                };
            })
        .withParagraphs([
                "⌗ {{learn}}"
            ],
            state => !hasSpellInSpellbook(state, spell.name),
            state => {
                return {
                    alignStyle: ParagraphAlignStyle.list
                };
            })
        .withParagraphs([
                "⤫ {{unlearn}}"
            ],
            state => hasSpellInSpellbook(state, spell.name),
            state => {
                return {
                    alignStyle: ParagraphAlignStyle.list
                };
            })
        .withParagraphs(backParagraphs, undefined, state => {
            return {
                alignStyle: ParagraphAlignStyle.default
            };
        })
        .withLink(backIdentifier, backSeneId)
        .withLink("learn", learnSceneId)
        .withLink("unlearn", unlearnSceneId);

    game.addScene(learnSceneId)
        .withBackgroundImage(backgroundImage)
        .withParagraphs([
            `Spell "${spell.name}" added to spellbook`
        ])
        .withParagraphs(backParagraphs)
        .withLink(backIdentifier, backSeneId)
        .onInit(state => {
            addSpellToSpellbook(state, spell);
        });

    game.addScene(unlearnSceneId)
        .withBackgroundImage(backgroundImage)
        .withParagraphs([
            `Spell "${spell.name}" removed from spellbook`
        ])
        .withParagraphs(backParagraphs)
        .withLink(backIdentifier, backSeneId)
        .onInit(state => {
            removeSpellFromSpellbook(state, spell.name);
        });

    return scene;
}