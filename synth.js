$(function () {
    var context = new AudioContext();

    var keyboard = qwertyHancock({
        id: 'keyboard',
        width: 600,
        height: 150,
        startNote: 'A3',
        whiteNotesColour: 'white',
        blackNotesColour: 'black',
        hoverColour: 'yellow'
    });

    active_nodes = [];

    function playNote(frequency) {
        var oscillator = context.createOscillator(),
        gainNode = context.createGain();

        oscillator.type = oscillator.SQUARE;
        oscillator.frequency.value = frequency;
        gainNode.gain.value = 0.3;
        oscillator.connect(gainNode);
        oscillator.start(0);

        gainNode.connect(context.destination);
        return oscillator;
    };

    keyboard.keyDown(function (_, frequency) {
        oscillator = playNote(frequency);
        active_nodes.push(oscillator);
    });

    keyboard.keyUp(function (_, frequency) {
        for (var i = 0; i < active_nodes.length; i++) {
            if (Math.round(active_nodes[i].frequency.value) === Math.round(frequency)) {
                active_nodes[i].stop(0);
                active_nodes[i].disconnect();
            }
        }
    });
});
