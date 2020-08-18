import { ISpell } from '.';

export class MemorizeSpell implements ISpell {

    name: string = "memorize";
    identifier: string = "memorize";
    icon: string = "";
    descriptionParagraphs: string[] = [
        "Memorize pieces of information from scrolls or speech"
    ];

}
