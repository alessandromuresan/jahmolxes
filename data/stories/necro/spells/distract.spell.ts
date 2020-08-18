import { ISpell } from '.';

export class DistractSpell implements ISpell {

    name: string = "distract";
    identifier: string = "distract";
    icon: string = "";
    descriptionParagraphs: string[] = [
        "Distract enemies, allowing escape"
    ];

}
