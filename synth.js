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
