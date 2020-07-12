import { Game } from '../../src/models/game.model';

export function oceanus(game: Game) {

    game.introTitle = "Oceanus";
    game.beginText = "Travel";
    game.backText = "←";
    game.backgroundUrl = "assets/img/intro-bg.jpg";

    game.introParagraphs = [
        "Disturbed by the things he saw in the forest, Jahmolxes travels to the Eternal Prison to find answers"
    ];

    jahmolxesDives(game, 'jahmolxesDives');
}

function jahmolxesDives(game: Game, scenesPrefix: string) {

    game.setStartingScene(`${scenesPrefix}-1`);

    game.addScene(`${scenesPrefix}-1`)
        .withParagraphs([
            "Jahmolxes arrived at the Ocean's shore at dusk.",
            "gazing in the distance, bla",
            "He {{jumps}}"
        ])
        .withBackgroundImage("assets/img/ocean_dusk.jpg")
        .withLink("jumps", `${scenesPrefix}-2`);

    game.addScene(`${scenesPrefix}-2`)
        .withParagraphs([
            "He dives down to the {{bottom}}"
        ])
        .withLink("bottom", `${scenesPrefix}-3`)
        .withBackgroundImage("assets/img/ocean_dive.jpg")
        .withBackButton();

    game.addScene(`${scenesPrefix}-3`)
        .withParagraphs([
            "He discovers the prison is {{empty}}"
        ])
        .withLink("empty", `${scenesPrefix}-4`)
        .withBackButton();

    game.addScene(`${scenesPrefix}-4`)
        .withParagraphs([
            "Dramatic music plays"
        ])
        .withBackButton();
}
