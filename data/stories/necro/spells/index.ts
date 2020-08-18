import { IGameState } from '../../../../src/models/game.model';

export interface ISpell {
    name: string;
    identifier: string;
    icon: string;
    descriptionParagraphs: string[];
}

export const spellsVariableName = "player_spells";

export function addSpellToSpellbook(state: IGameState, spell: ISpell) {

    let spellsVariable = getSpellsVariable(state);

    spellsVariable.push(spell);

    state.setComplexVariable(spellsVariableName, spellsVariable);
}

export function removeSpellFromSpellbook(state: IGameState, spellName: string) {

    let spellsVariable = getSpellsVariable(state);

    const spellIndex = spellsVariable.map(s => s.name).indexOf(spellName);

    if (spellIndex !== -1) {
        spellsVariable.splice(spellIndex, 1);
    }

    state.setComplexVariable(spellsVariableName, spellsVariable);
}

export function hasSpellInSpellbook(state: IGameState, spellName: string): boolean {

    let spellsVariable = getSpellsVariable(state);

    return spellsVariable.some(s => s.name === spellName);
}

export function getSpellsVariable(state: IGameState): ISpell[] {

    return state.getComplexVariable<ISpell[]>(spellsVariableName) || [];
}
