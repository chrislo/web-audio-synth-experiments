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

    keyboard.keyDown(function (_, frequency) {
        vco.frequency.value = frequency;
        vca.gain.value = 1;
    });

    keyboard.keyUp(function (_, _) {
        vca.gain.value = 0;
    });
});
