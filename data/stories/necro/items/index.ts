import { IGameState } from '../../../../src/models/game.model';

export interface IItem {
    name: string;
    identifier: string;
    icon: string;
    descriptionParagraphs: string[];
}

export const itemsVariableName = "player_items";

export function addItemToInventory(state: IGameState, item: IItem): void {

    let itemsVariable = getItemsVariable(state);

    itemsVariable.push(item);

    state.setComplexVariable(itemsVariableName, itemsVariable);
}

export function getItemsVariable(state: IGameState): IItem[] {

    return state.getComplexVariable<IItem[]>(itemsVariableName) || [];
}
