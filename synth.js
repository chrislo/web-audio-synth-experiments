$(function () {
    var keyboard = qwertyHancock({id: 'keyboard'});

    var context = new AudioContext();

    /* VCO */
    var vco = context.createOscillator();
    vco.type = vco.SINE;
    vco.frequency.value = this.frequency;
    vco.start(0);

    /* VCA */
    var vca = context.createGain();
    vca.gain.value = 0;

    /* Connections */
    vco.connect(vca);
    vca.connect(context.destination);

    var isEmpty = function(obj) {
        return Object.keys(obj).length === 0;
    }

    depressed_keys = {}

    keyboard.keyDown(function (note, frequency) {
        vco.frequency.value = frequency;
        vca.gain.value = 1;
        depressed_keys[note] = true;
    });

    keyboard.keyUp(function (note, _) {
        delete depressed_keys[note];
        if (isEmpty(depressed_keys)) {
            vca.gain.value = 0;
        }
    });
});
