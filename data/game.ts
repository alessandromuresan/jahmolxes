import { Game } from '../src/models/game.model';

export function configureGame(game: Game) {

    configureJahmolxesParable(game);
};

function configureJahmolxesParable(game: Game) {

    configureIntroScenes(game, 'intro');
}

function configureIntroScenes(game: Game, introScenesPrefix: string) {

    game.setStartingScene(`${introScenesPrefix}-1`);

    game.addScene(`${introScenesPrefix}-1`)
        .withParagraphs([
            'On his way to the mountains to meditate, Jahmolxes once came across a strange {{road}}, beginning from within the forest .'
        ])
        .withLink('road', `${introScenesPrefix}-2`);

    game.addScene(`${introScenesPrefix}-2`)
        .withParagraphs([
            'How these lands still hold such little secrets, Jahmolxes thought .',
            'He smiled and entered the {{forest}} to take the new route .'
        ])
        .withLink('forest', `${introScenesPrefix}-3`)
        .withBackButton();

    game.addScene(`${introScenesPrefix}-3`)
        .withParagraphs([
            'The road was steep and narrow, and grew more so with each {{step}} .'
        ])
        .withLink('step', `${introScenesPrefix}-4`)
        .withBackButton();

    const gladeScenesPrefix = `${introScenesPrefix}-glade`;
    const roadScenesPrefix = `${introScenesPrefix}-road`;

    game.addScene(`${introScenesPrefix}-4`)
        .withParagraphs([
            'After many turns and climbs, Jahmolxes came upon a small glade, surrounded by tall pines .',
            'Though feeling inspired by the clearing\'s playful {{lights}}, he also thought about the {{journey}} lying ahead ...'
        ])
        .withLink('lights', `${gladeScenesPrefix}-1`)
        .withLink('journey', `${roadScenesPrefix}-1`)
        .withBackButton();

    configureGladeScenes(game, `${gladeScenesPrefix}`);
    configureRoadScenes(game, `${roadScenesPrefix}`);
}

function configureGladeScenes(game: Game, gladeScenesPrefix: string) {

    game.addScene(`${gladeScenesPrefix}-1`)
        .withParagraphs([
            'Following the thin rays of light that bathed the glade, Jahmolxes saw that the trees had formed a perfect circle, at the center of which stood a stone {{well}} .',
            'All the light seemed to be pointing to it ...'
        ])
        .withLink('well', `${gladeScenesPrefix}-2`)
        .withBackButton();

    game.addScene(`${gladeScenesPrefix}-2`)
        .withParagraphs([
            'He approached the well and gazed into it .',
            'TO BE CONTINUED BY ALEX'
        ])
        .withBackButton();
}

function configureRoadScenes(game: Game, roadScenesPrefix: string) {
    
    game.addScene(`${roadScenesPrefix}-1`)
        .withParagraphs([
            'Jahmolxes followed the road ahead until it came to an abrupt {{end}} .'
        ])
        .withLink('end', `${roadScenesPrefix}-2`)
        .withBackButton();

    game.addScene(`${roadScenesPrefix}-2`)
        .withParagraphs([
            'The forest had become sparse by this point, so it could be passed by foot in order to {{advance}} .'
        ])
        .withLink('advance', `${roadScenesPrefix}-3`)
        .withBackButton();

    game.addScene(`${roadScenesPrefix}-3`)
        .withParagraphs([
            'Large rock formations rised here and there, more frequently as he wondered deeper into the woods .',
            'Finally, Jahmolxes came across the mountain\'s thick {{walls}}, reaching far up to the sky .'
        ])
        .withLink('walls', `${roadScenesPrefix}-4`)
        .withBackButton();

    game.addScene(`${roadScenesPrefix}-4`)
        .withParagraphs([
            'There, he noticed an entrance in the mountain, a large arch that looked like it had been built .',
            'TO BE CONTINUED BY TUDOR'
        ])
        .withBackButton();
}