import { Game } from '../src/models/game.model';

export function configureGame(game: Game) {

    configureRoomGame(game);
};

function configureRoomGame(game: Game) {

    game.setStartingScene('room');

    game.addScene('room')
        .configureParagraphs(paragraphs => {

            paragraphs.add('You are in a room.')
                    .add('The only things here are a {{door}}, a dirty {{window}} and an old {{cupboard}}.');
        })
        .configureIdentifiers(identifiers => {

            identifiers.for('door')
                .linkScene('inspect-door');

            identifiers.for('window')
                .linkScene('inspect-window');

            identifiers.for('cupboard')
                .linkScene('inspect-cupboard');
        });

    game.addScene('inspect-door')
        .configureParagraphs(paragraphs => {

            paragraphs.add(['Locked.', 'Maybe there\'s a key somewhere in the {{room}}...'], game => !game.data.hasKey)
                    .add('Time to get {{out}}', game => game.data.hasKey);
        })
        .configureIdentifiers(identifiers => {

            identifiers.for('room')
                .text('room')
                .linkScene('room');

            identifiers.for('out')
                .text('out')
                .linkScene('exit');
        });

    game.addScene('inspect-window')
        .configureParagraphs(paragraphs => {

            paragraphs.add('Can\'t even see anything through...')
                    .add('Best to {{$back}}');
        })
        .configureIdentifier('$back', identifier => {
            identifier.text('keep looking around...');
        });

    game.addScene('inspect-cupboard')
        .configureParagraphs(paragraphs => {

            paragraphs.add(['There\'s a rusty key in here.', 'I could {{grabKey}} or {{keepLooking}}'], game => !game.data.hasKey)
                    .add('Nothing here anymore...', game => game.data.hasKey);
        })
        .configureIdentifiers(identifiers => {

            identifiers.for('keepLooking')
                    .text('keep looking around...')
                    .linkScene('room');

            identifiers.for('grabKey')
                    .text('take it')
                    .linkScene('room')
                    .onselect(game => {
                        game.data.hasKey = true;
                    });
        });

    game.addScene('exit')
        .configureParagraphs(paragraphs => {
            paragraphs.add('To be continued...');
        });
}