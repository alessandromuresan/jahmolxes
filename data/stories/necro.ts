import { Game } from '../../src/models/game.model';
import { GameCommand } from '../../src/models/dispatcher.model';

export function necro(game: Game) {

    game.introTitle = "Necro";
    game.loadingText = "Loading...";
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
        .withLink("investigation", "village_entrance");

    game.addScene("village_entrance")
        .withParagraphs([
            "Your carriage lets you off at a modest village covered by snow.",
            "From what the coachman said while traveling, this village served as a mill for the surrounding region for the past years, but shipments recently stopped...",
            "→ {{enter}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("enter", "village_square");

    game.addScene("village_square")
        .withParagraphs([
            "In the village square, only a {{notice}} board stands"
        ], state =>
            !state.getBooleanVariable("first_house_viewed") &&
            !state.getBooleanVariable("first_house_noise_outside") &&
            state.getBooleanVariable("first_house_porch_viewed")
        )
        .withParagraphs([
            "In the village square, only a {{notice}} board stands",
            "A door closes in a nearby {{house}}"
        ], state => 
            !state.getBooleanVariable("first_house_viewed") &&
            !state.getBooleanVariable("first_house_noise_outside") &&
            !state.getBooleanVariable("first_house_porch_viewed")
        )
        .withParagraphs([
            "The village square, with its {{notice}} board",
            "👁 investigate {{house}}"
        ], state =>
            state.getBooleanVariable("first_house_viewed") &&
            !state.getBooleanVariable("first_house_noise_outside")
        )
        .withParagraphs([
            "The village square, with its {{notice}} board",
            "← back to {{house}}"
        ], state =>
            state.getBooleanVariable("first_house_viewed") &&
            state.getBooleanVariable("first_house_noise_outside")
        )
        .withBackgroundImage(firstBackgroundImage)
        .withLink("notice", "notice")
        .withLink("house", "first_house", state => state.getBooleanVariable("first_house_porch_viewed"))
        .withLink("house", "porch", state => !state.getBooleanVariable("first_house_porch_viewed"))
        .onInit(state => {

            if (state.getBooleanVariable("first_house_noise_outside")) {
                state.setBooleanVariable("village_square_noise_investigated", true);
            }
        });

    game.addScene("notice")
        .withParagraphs([
            "\"Quarantine effective immediately. All men, women and children must remain in their homes until further notice.\"",
            "← {{back}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "village_square");

    game.addScene("porch")
        .withParagraphs([
            "The porch is fresh with {{footsteps}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("footsteps", "footsteps")
        .onInit(state => {
            
            state.setBooleanVariable("first_house_porch_viewed", true);
        });

    game.addScene("footsteps")
        .withParagraphs([
            "They lead to the {{door}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("door", "first_house");

    game.addScene("first_house")
        .withParagraphs([
            "What a terrible way to live... Nothing but a {{bed}} and a {{cabinet}}",
            "← {{back}}"
        ], state =>
            state.getNumberVariable("first_house_view_count") === 1
        )
        .withParagraphs([
            "A room with a {{bed}} and a {{cabinet}}",
            "← {{back}}"
        ], state =>
            state.getNumberVariable("first_house_view_count") !== 1 && (
                !state.getBooleanVariable("first_house_bed_viewed") ||
                !state.getBooleanVariable("first_house_cabinet_viewed") ||
                state.getBooleanVariable("village_square_noise_investigated")
            )
        )
        .withParagraphs([
            "A room with a {{bed}} and a {{cabinet}}",
            "Snow rustles {{outside}} in the distance"
        ], state =>
            state.getNumberVariable("first_house_view_count") !== 1 &&
            state.getBooleanVariable("first_house_noise_outside") &&
            !state.getBooleanVariable("village_square_noise_investigated")
        )
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "village_square")
        .withLink("bed", "first_house_bed")
        .withLink("cabinet", "first_house_cabinet")
        .withLink("outside", "village_square")
        .onInit(state => {

            state.setBooleanVariable("first_house_viewed", true);

            if (typeof state.getNumberVariable("first_house_view_count") === "number") {
                state.setNumberVariable("first_house_view_count", state.getNumberVariable("first_house_view_count") + 1);
            } else {
                state.setNumberVariable("first_house_view_count", 1);
            }
        });

    game.addScene("first_house_bed")
        .withParagraphs([
            "It's just a bunch of straws in a wooden box",
            "← {{back}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "first_house")
        .onInit(state => {

            state.setBooleanVariable("first_house_bed_viewed", true);

            if (state.getBooleanVariable("first_house_cabinet_viewed")) {
                state.setBooleanVariable("first_house_noise_outside", true);
            }
        });

    game.addScene("first_house_cabinet")
        .withParagraphs([
            "A dusty cabinet with a {{knife}} in it",
            "← {{back}}"
        ], state => 
            !state.getBooleanVariable("has_knife")
        )
        .withParagraphs([
            "A dusty empty cabinet",
            "← {{back}}"
        ], state => 
            state.getBooleanVariable("has_knife")
        )
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "first_house")
        .withLink("knife", "first_house_cabinet_knife")
        .onInit(state => {

            state.setBooleanVariable("first_house_cabinet_viewed", true);

            if (state.getBooleanVariable("first_house_bed_viewed")) {
                state.setBooleanVariable("first_house_noise_outside", true);
            }
        });

    game.addScene("first_house_cabinet_knife")
        .withParagraphs([
            "A knife probably used for cutting meat",
            "🗡 {{take}}",
            "← {{back}}"
        ], state => 
            !state.getBooleanVariable("has_knife")
        )
        .withBackgroundImage(firstBackgroundImage)
        .withLink("take", "first_house_cabinet_knife_take")
        .withLink("back", "first_house");

    game.addScene("first_house_cabinet_knife_take")
        .withParagraphs([
            "Knife taken",
            "← {{back}}"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "first_house")
        .onInit(state => {

            state.setBooleanVariable("has_knife", true);
        });
}
