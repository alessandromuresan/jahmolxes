import { Game } from '../../src/models/game.model';
import { GameCommand } from '../../src/models/dispatcher.model';

export function necro(game: Game) {

    game.introTitle = "Necro";
    game.beginText = "Begin";
    game.backText = "←";
    game.backgroundUrl = "assets/img/intro-bg.jpg";
    game.backgroundSoundSrc = "assets/sound/Old_Sorcery-Clandestine_Meditation_in_Two_Chapters.mp3";

    game.introParagraphs = [
        "Necro test"
    ];

    game.setStartingScene("brief");

    const firstBackgroundImage = "assets/img/village_empty.jpg";

    game.addScene("brief")
        .withParagraphs([
            "We believe that someone in this region is practicing forbidden magic.",
            "Disclosure: forbidden.",
            "Assignment: {{investigation}}."
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("investigation", "1");

    game.addScene("1")
        .withParagraphs([
            "Your carriage lets you off at a modest village covered by snow.",
            "From what the coachman said while traveling, this village served as a mill for the surrounding region for the past years, but shipments recently stopped...",
            "→ {{enter}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("enter", "2");

    game.addScene("2")
        .withParagraphs([
            "In the village square, only a {{notice_board}} stands"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("notice_board", "3");

    game.addScene("3")
        .withParagraphs([
            "\"Quarantine effective immediately. All men, women and children must remain in their homes until further notice.\""
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("notice board", "3");
}
