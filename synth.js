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

    var active_sounds = {};

    var Sound = (function() {
        function Sound(frequency){
            this.frequency = frequency;
            this.nodes = [];
        };

        Sound.prototype.start = function() {
            var oscillator = context.createOscillator();
            gainNode = context.createGain();

            oscillator.type = oscillator.SQUARE;
            oscillator.frequency.value = this.frequency;
            oscillator.connect(gainNode);

            /* envelope */
            var now = context.currentTime;
            gainNode.gain.linearRampToValueAtTime(1.0, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.3);

            oscillator.start(now);

            gainNode.connect(context.destination);
            this.nodes.push(oscillator);
        };

        Sound.prototype.stop = function() {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].stop(0);
            }
        };

        return Sound;
    })();

    keyboard.keyDown(function (note, frequency) {
        var sound = new Sound(frequency);
        sound.start()
        active_sounds[note] = sound;
    });

    keyboard.keyUp(function (note, _) {
        active_sounds[note].stop();
        delete active_sounds[note];
    });
});
