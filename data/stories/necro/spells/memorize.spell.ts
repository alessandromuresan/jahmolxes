import { ISpell } from '.';

export const memorizeSpellName = "memorize";

export class MemorizeSpell implements ISpell {

    spellName: string = memorizeSpellName;
    identifier: string = "memorize";
    icon: string = "";
    descriptionParagraphs: string[] = [
        "Memorize pieces of information from scrolls or speech"
    ];

}
