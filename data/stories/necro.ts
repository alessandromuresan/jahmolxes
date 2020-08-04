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
            "Disclosure: unless necessary",
            "Assignment: {{investigation}}"
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
            "In the village square, only a {{notice}} board stands"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("notice", "notice");

    game.addScene("notice")
        .withParagraphs([
            "\"Quarantine effective immediately. All men, women and children must remain in their homes until further notice.\"",
            "→ {{exit}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("exit", "4");

    game.addScene("4")
        .withParagraphs([
            "In the village square, only a {{notice}} board stands",
            "A door closes in a nearby {{house}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("house", "5");

    game.addScene("5")
        .withParagraphs([
            "The porch is fresh with {{footsteps}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("footsteps", "6");

    game.addScene("6")
        .withParagraphs([
            "They lead to the {{door}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("door", "first_house");

    game.addScene("first_house")
        .withParagraphs([
            "What a terrible way to live... Nothing but a {{bed}} and a {{cabinet}}",
            "← {{back}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "village_square_revisited_after_firstenterhouse")
        .withLink("bed", "first_house_bed")
        .withLink("cabinet", "first_house_cabinet");

    game.addScene("village_square_revisited_after_firstenterhouse")
        .withParagraphs([
            "The village square, with its {{notice}} board",
            "→ investigate {{house}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("notice", "notice")
        .withLink("house", "first_house_after_firstenterhouse");

    game.addScene("first_house_bed")
        .withParagraphs([
            "It's just a bunch of straws in a wooden box",
            "← {{back}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "first_house_after_firstenterhouse");

    game.addScene("first_house_cabinet")
        .withParagraphs([
            "A dusty old cabinet",
            "← {{back}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "first_house_after_firstenterhouse");

    game.addScene("first_house_after_firstenterhouse")
        .withParagraphs([
            "A room with a {{bed}} and a {{cabinet}}",
            "← {{back}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "village_square_revisited_after_firstenterhouse")
        .withLink("bed", "first_house_bed")
        .withLink("cabinet", "first_house_cabinet");
}
