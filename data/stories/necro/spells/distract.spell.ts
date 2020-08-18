import { ISpell } from '.';

export const distractSpellName = "distract";

export class DistractSpell implements ISpell {

    spellName: string = distractSpellName;
    identifier: string = "distract";
    icon: string = "";
    descriptionParagraphs: string[] = [
        "Distract enemies, allowing escape"
    ];

}
