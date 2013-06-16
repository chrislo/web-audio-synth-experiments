/* Copyright 2013 Chris Lowis

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

$(function () {
    var context = new AudioContext();

    var keyboard = qwertyHancock({
        id: 'keyboard',
        width: 600,
        height: 150,
        startNote: 'A1',
        whiteNotesColour: 'white',
        blackNotesColour: 'black',
        hoverColour: 'yellow'
    });

    var active_sounds = {};

    var Sound = (function(context) {
        function Sound(frequency){
            this.frequency = frequency;
            this.nodes = [];
        };

        Sound.prototype.start = function() {

            var now = context.currentTime;

            /* Oscillator */
            var oscillator = context.createOscillator();
            oscillator.type = oscillator.SQUARE;
            oscillator.frequency.value = this.frequency;

            /* LFO */
            var lfo = context.createOscillator();
            lfo.type = lfo.SINE;
            lfo.frequency.value = 5;

            /* LFO amplitude */
            var lfo_amplitude = context.createGain();
            lfo_amplitude.gain.value = 50;

            /* Low-pass filter */
            var filter = context.createBiquadFilter();
            filter.frequency.value = this.frequency * 2;
            filter.type = filter.LOWPASS;
            filter.Q.value = 1;

            /* output gain */
            var gain = context.createGain();
            gain.gain.value = 0.3;

            /* connect it up */
            oscillator.connect(filter);
            filter.connect(gain);
            gain.connect(context.destination);
            lfo.connect(lfo_amplitude);
            lfo_amplitude.connect(filter.frequency);

            oscillator.start(now);
            lfo.start(now);

            this.nodes.push(oscillator);
            this.nodes.push(lfo);
        };

        Sound.prototype.stop = function() {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].stop(0);
            }
        };

        return Sound;
    })(context);

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
