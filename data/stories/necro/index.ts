import { Game, IGameState } from '../../../src/models/game.model';
import { ParagraphTextStyle, AnimationType, ParagraphAlignStyle } from '../../../src/models/game-scene.model';
import spellbookSpellScene from './scene-templates/spellbook-spell.scene';
import { MemorizeSpell, memorizeSpellName } from './spells/memorize.spell';
import { DistractSpell, distractSpellName } from './spells/distract.spell';
import { hasSpellInSpellbook } from './spells';

const firstBackgroundImage = "assets/img/village_empty.jpg";

export function necro(game: Game) {

    game.introTitle = "Necro";
    game.loadingText = "Loading...";
    game.beginText = "Begin";
    game.backText = "←";
    game.backgroundUrl = "assets/img/intro-bg.jpg";
    game.backgroundSoundSrc = "assets/sound/necro-ost-1.wav";
    game.soundAssetSrcs = [
        "assets/sound/necro_ost_piano_heaven_Master-01.wav",
        "assets/sound/necro_ost_piano_heaven_Master-02.wav",
        "assets/sound/necro_ost_piano_heaven_Master-03.wav",
        "assets/sound/necro_ost_piano_heaven_Master-04.wav",
        "assets/sound/necro_ost_piano_heaven_Master-05.wav",
        "assets/sound/necro_ost_piano_heaven_Master-06.wav",
        "assets/sound/necro_ost_piano_heaven_Master-07.wav",
        "assets/sound/necro_ost_piano_heaven_Master-08.wav"
    ];

    game.introParagraphs = [
        "Necro test"
    ];

    // game.setStartingScene("brief");
    game.setStartingScene("church");

    game.addScene("brief")
        .withParagraphs([
            "We believe that someone in this region is practicing forbidden magic.",
            "Disclosure: prohibited",
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
            state.getNumberVariable("village_square_view_count") === 1
        )
        .withParagraphs([
            "In the village square, only a {{notice}} board stands"
        ], state => 
            state.getNumberVariable("village_square_view_count") !== 1 &&
            !state.getBooleanVariable("first_house_viewed") &&
            !state.getBooleanVariable("first_house_noise_outside") &&
            !state.getBooleanVariable("first_house_porch_viewed")
        )
        .withParagraphs([
            "A door closes in a nearby {{house}}"
        ], state => 
            state.getNumberVariable("village_square_view_count") !== 1 &&
            !state.getBooleanVariable("first_house_viewed") &&
            !state.getBooleanVariable("first_house_noise_outside") &&
            !state.getBooleanVariable("first_house_porch_viewed")
        , state => {

            return {
                animationType: AnimationType.fadeIn
            };
        })
        .withParagraphs([
            "The village square, with its {{notice}} board",
            "👁 investigate {{house}}"
        ], state =>
            state.getNumberVariable("village_square_view_count") !== 1 &&
            state.getBooleanVariable("first_house_viewed") &&
            !state.getBooleanVariable("first_house_noise_outside")
        )
        .withParagraphs([
            "The village square, with its {{notice}} board",
            "← back to {{house}}"
        ], state =>
            state.getNumberVariable("village_square_view_count") !== 1 &&
            state.getBooleanVariable("first_house_viewed") &&
            state.getBooleanVariable("first_house_noise_outside")
        )
        .withBackgroundImage(firstBackgroundImage)
        .withLink("notice", "notice")
        .withLink("house", "first_house", state => state.getBooleanVariable("first_house_porch_viewed"))
        .withLink("house", "porch", state => !state.getBooleanVariable("first_house_porch_viewed"))
        .onInit(state => {

            if (typeof state.getNumberVariable("village_square_view_count") === "number") {
                state.setNumberVariable("village_square_view_count", state.getNumberVariable("village_square_view_count") + 1);
            } else {
                state.setNumberVariable("village_square_view_count", 1);
            }

            if (state.getBooleanVariable("first_house_noise_outside")) {
                state.setBooleanVariable("village_square_noise_investigated", true);
            }

            if (
                state.getNumberVariable("village_square_view_count") !== 1 &&
                !state.getBooleanVariable("first_house_viewed") &&
                !state.getBooleanVariable("first_house_noise_outside") &&
                !state.getBooleanVariable("first_house_porch_viewed")
            ) {
                state.playSound("assets/sound/necro_ost_piano_heaven_Master-03.wav", {
                    volume: 0.9
                });
            }
        });

    game.addScene("notice")
        .withParagraphs([
            "\"Quarantine effective immediately. All men, women and children must remain in their homes until further notice.\"",
            "← {{back}}"
        ], state =>
            !state.getBooleanVariable("village_square_noise_investigated")
        )
        .withParagraphs([
            "\"Quarantine effective immediately. All men, women and children must remain in their homes until further notice.\"",
        ], state =>
            state.getBooleanVariable("village_square_noise_investigated")
        )
        .withParagraphs([
            "\"Meet me at the {{church}}\""
        ], state =>
            state.getBooleanVariable("village_square_noise_investigated")
        , state => {

            return {
                animationType: AnimationType.fadeIn
            }
        })
        .withParagraphs([
            "← {{back}}"
        ], state =>
            state.getBooleanVariable("village_square_noise_investigated")
        )
        .withBackgroundImage(firstBackgroundImage)
        .withLink("back", "village_square")
        .withLink("church", "church")
        .onIdentifierSelect("church", state => {
            state.setBooleanVariable("notice_church_clicked", true);
        })
        .onInit(state => {

            if (state.getBooleanVariable("village_square_noise_investigated")) {
                state.playSound("assets/sound/necro_ost_piano_heaven_Master-06.wav", {
                    volume: 0.9
                });
            }
        });

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
            "A room with a {{bed}} and a {{cabinet}}"
        ], state =>
            state.getNumberVariable("first_house_view_count") !== 1 &&
            state.getBooleanVariable("first_house_noise_outside") &&
            !state.getBooleanVariable("village_square_noise_investigated")
        )
        .withParagraphs([
            "Snow rustles {{outside}} in the distance"
        ], state =>
            state.getNumberVariable("first_house_view_count") !== 1 &&
            state.getBooleanVariable("first_house_noise_outside") &&
            !state.getBooleanVariable("village_square_noise_investigated")
        , state => {

            return {
                animationType: AnimationType.fadeIn
            }
        })
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

            if (
                state.getNumberVariable("first_house_view_count") !== 1 &&
                state.getBooleanVariable("first_house_noise_outside") &&
                !state.getBooleanVariable("village_square_noise_investigated")
            ) {
                state.playSound("assets/sound/necro_ost_piano_heaven_Master-08.wav", {
                    volume: 0.9
                })
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

            state.playSound("assets/sound/necro_ost_piano_heaven_Master-07.wav", {
                volume: 0.9
            })
        });

    game.addScene("church")
        .withParagraphs([
            "The church stands on a nearby {{hill}}."
        ])
        .withBackgroundImage(firstBackgroundImage)
        .withLink("hill", "hill");

        game.addScene("hill")
        .withParagraphs([
            "From atop the hill you can see the entire village"
        ])
        .withBackgroundImage(firstBackgroundImage)
        .onInit(state => {

            setTimeout(() => {
                
                state.getCurrentScene()
                    .configureParagraphs(p => {

                        p.add([
                            "Greetings stranger"
                        ], () => true, state => {

                            return {
                                animationType: AnimationType.fadeIn,
                                textStyle: ParagraphTextStyle.italic
                            }
                        });

                        state.refreshScene();
                    });

                state.playSound("assets/sound/necro_ost_piano_heaven_Master-03.wav", {
                    volume: 0.9
                });

                setTimeout(() => {
                    
                    state.getCurrentScene()
                        .configureParagraphs(p => {

                            const currentParagraphs = p.getParagraphs();

                            currentParagraphs[1].style = () => {

                                return {
                                    animationType: AnimationType.default,
                                    textStyle: ParagraphTextStyle.italic
                                };
                            };

                            p.add([
                                "Says a voice from {{behind}}"
                            ], () => true, state => {

                                return {
                                    animationType: AnimationType.fadeIn,
                                    textStyle: ParagraphTextStyle.default
                                }
                            });

                        state.refreshScene();
                    });

                }, 1 * 1000);

            }, 2 * 1000);
        })
        .withLink("behind", "church_voice_behind")

    defineContactNpc(game, "church_voice_behind", "church_hub");

    game.addScene("church_hub")
        .withParagraphs([
                "The village lookout hill, with the {{church}} and the priest {{house}}."
            ]
        )
        .withParagraphs([
                "The area {{contact}} is in front of you."
            ],
            state => !briefedWithMillPatron(state) || !churchSpellsLearned(state)
        )
        .withParagraphs([
                "From what the area contact said, it would be wise to talk to the mill {{patron}}."
            ],
            state => briefedWithMillPatron(state) && !investigatedMillPatron(state)
        )
        .withLink("church", "church_building")
        .withLink("house", "priest_house_building")
        .withLink("patron", "priest_house_building")
        .withLink("contact", "church_voice_behind")
}

function defineContactNpc(game: Game, startingSceneId: string, backSceneId: string) {

    const backIdentifier = "back"
    const backParagraph = `← {{${backIdentifier}}}`;

    const startingParagraphsFirstTime = [
        "I apologize for the fright... But it isn't safe to talk on the streets."
    ]

    const startingParagraphs = [
        "I am your assigned contact for this area, what would you like to know?"
    ];

    const startingOptionsParagraphs = [
        "→ Why did the mill {{shipments}} stop?",
        "→ What is the {{magic}} status in the area?"
    ];

    const shipmentsSceneId = `${startingSceneId}_shipments`;
    const magicSceneId = `${startingSceneId}_magic`;
    const viewSpellsSceneId = `${startingSceneId}_view_spells`;
    const memorizeSpellSceneId= `${startingSceneId}_memorize_spell`;
    const distractSpellSceneId = `${startingSceneId}_distract_spell`;

    const shipmentSceneParagraphs = [
        "From what information I've gathered, the local mill had an incident recently,",
        "when most workers fell ill with fever and couldn't perform their duties anymore.",
        "The patron closed shop soon after.",
        "I recommend talking to him for further details."
    ];

    const magicSceneParagraphs = [
        "We are in an unregulated zone, so we will have to rely on local magic.",
        "I've managed to compile a list of working spells, would you like to {{view}} it?"
    ];

    const viewSpellsSceneParagraphs = [
        "This spell book contains the following:"
    ];

    const viewSpellsOptionsParagraphs = [
        "→ {{memorize}}",
        "→ {{distract}}",
    ];

    game.addScene(startingSceneId)
        .withBackgroundImage(firstBackgroundImage)
        .withParagraphs(startingParagraphsFirstTime, state => !briefedWithLocalSpells(state) && !briefedWithMillPatron(state), state => {
            
            return {
                animationType: AnimationType.default,
                textStyle: ParagraphTextStyle.italic
            };
        })
        .withParagraphs(startingParagraphs, undefined, state => {
            
            return {
                animationType: AnimationType.default,
                textStyle: ParagraphTextStyle.italic
            };
        })
        .withParagraphs(startingOptionsParagraphs, undefined, state => {
            
            return {
                animationType: AnimationType.default,
                textStyle: ParagraphTextStyle.default,
                alignStyle: ParagraphAlignStyle.list
            };
        })
        .withParagraphs([
            backParagraph
        ], undefined, state => {

            return {
                textStyle: ParagraphTextStyle.default
            }
        })
        .withLink(backIdentifier, backSceneId)
        .withLink("shipments", shipmentsSceneId)
        .withLink("magic", magicSceneId)
        .onInit(state => {
            markChurchContactVisited(state);
        })

    game.addScene(shipmentsSceneId)
        .withBackgroundImage(firstBackgroundImage)
        .withParagraphs(shipmentSceneParagraphs, undefined, state => {
            
            return {
                animationType: AnimationType.default,
                textStyle: ParagraphTextStyle.italic
            };
        })
        .withParagraphs([
            backParagraph
        ], undefined, state => {

            return {
                textStyle: ParagraphTextStyle.default
            }
        })
        .withLink(backIdentifier, startingSceneId)
        .onInit(state => {
            markBriefedWithMillPatron(state);
        })

    game.addScene(magicSceneId)
        .withBackgroundImage(firstBackgroundImage)
        .withParagraphs(magicSceneParagraphs,
            state => !churchSpellsLearned(state),
            state => {
            
                return {
                    animationType: AnimationType.default,
                    textStyle: ParagraphTextStyle.italic
                };
            })
        .withParagraphs(magicSceneParagraphs,
            state => churchSpellsLearned(state),
            state => {
                
                return {
                    animationType: AnimationType.default,
                    textStyle: ParagraphTextStyle.italic
                };
            })
        .withParagraphs([
            backParagraph
        ], undefined, state => {

            return {
                textStyle: ParagraphTextStyle.default
            }
        })
        .withLink("view", viewSpellsSceneId)
        .withLink(backIdentifier, startingSceneId)
        .onInit(state => {
            markBriefedWithLocalSpells(state);
        })

    game.addScene(viewSpellsSceneId)
        .withBackgroundImage(firstBackgroundImage)
        .withParagraphs(viewSpellsSceneParagraphs)
        .withParagraphs(viewSpellsOptionsParagraphs, undefined, state => {

            return {
                textStyle: ParagraphTextStyle.default,
                animationType: AnimationType.default,
                alignStyle: ParagraphAlignStyle.list
            }
        })
        .withParagraphs([
            backParagraph
        ], undefined, state => {

            return {
                textStyle: ParagraphTextStyle.default,
                animationType: AnimationType.default,
                alignStyle: ParagraphAlignStyle.default
            }
        })
        .withLink("memorize", memorizeSpellSceneId)
        .withLink("distract", distractSpellSceneId)
        .withLink(backIdentifier, magicSceneId)

    const memorizeSpellScene = spellbookSpellScene(game, memorizeSpellSceneId, viewSpellsSceneId, firstBackgroundImage, new MemorizeSpell());
    const distractSpellScene = spellbookSpellScene(game, distractSpellSceneId, viewSpellsSceneId, firstBackgroundImage, new DistractSpell());

    memorizeSpellScene.withBackgroundImage(firstBackgroundImage);
    distractSpellScene.withBackgroundImage(firstBackgroundImage);

    // game.addScene(memorizeSpellSceneId)
    //     .withBackgroundImage(firstBackgroundImage)
    //     .withParagraphs([
    //         "memorize spell description"
    //     ])
    //     .withParagraphs([
    //         "{{learn}}"
    //     ], undefined, state => {

    //         return {
    //             alignStyle: ParagraphAlignStyle.list
    //         }
    //     })
    //     .withParagraphs([
    //         backParagraph
    //     ], undefined, state => {

    //         return {
    //             alignStyle: ParagraphAlignStyle.default
    //         }
    //     })
    //     .withLink(backIdentifier, viewSpellsSceneId)

    // game.addScene(distractSpellSceneId)
    //     .withBackgroundImage(firstBackgroundImage)
    //     .withParagraphs([
    //         "distract spell description",
    //         backParagraph
    //     ])
    //     .withLink(backIdentifier, viewSpellsSceneId)
}

function churchSpellsLearned(state: IGameState) {
    return hasSpellInSpellbook(state, memorizeSpellName) && hasSpellInSpellbook(state, distractSpellName);
}

function churchContactVisited(state: IGameState) {
    return state.getBooleanVariable("church_contact_visited");
}

function markChurchContactVisited(state: IGameState) {
    state.setBooleanVariable("church_contact_visited", true);
}

function briefedWithMillPatron(state: IGameState) {
    return state.getBooleanVariable("church_contact_briefed_with_mill_patron");
}

function markBriefedWithMillPatron(state: IGameState) {
    return state.setBooleanVariable("church_contact_briefed_with_mill_patron", true);
}

function investigatedMillPatron(state: IGameState) {
    return state.getBooleanVariable("mill_patron_investigated");
}

function markInvestigatedMillPatron(state: IGameState) {
    return state.setBooleanVariable("mill_patron_investigated", true);
}
function briefedWithLocalSpells(state: IGameState) {
    return state.getBooleanVariable("church_contact_briefed_with_local_spells");
}

function markBriefedWithLocalSpells(state: IGameState) {
    return state.setBooleanVariable("church_contact_briefed_with_local_spells", true);
}
