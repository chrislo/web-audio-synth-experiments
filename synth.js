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
  var keyboard = qwertyHancock({id: 'keyboard', startNote: 'A4', octaves: 2});

  var context = new AudioContext();

  var VCO = (function(context) {
    function VCO(){
      this.oscillator = context.createOscillator();
      this.oscillator.type = this.oscillator.SAWTOOTH;
      this.setFrequency(440);
      this.oscillator.start(0);

      this.input = this.oscillator;
      this.output = this.oscillator;

      var that = this;
      $(document).bind('frequency', function (_, frequency) {
        that.setFrequency(frequency);
      });
    };

    VCO.prototype.setFrequency = function(frequency) {
      this.oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    };

    VCO.prototype.connect = function(node) {
      if (node.hasOwnProperty('input')) {
        this.output.connect(node.input);
      } else {
        this.output.connect(node);
      };
    }

    return VCO;
  })(context);

  var VCA = (function(context) {
    function VCA() {
      this.gain = context.createGain();
      this.gain.gain.value = 0;
      this.input = this.gain;
      this.output = this.gain;
      this.amplitude = this.gain.gain;
    };

    VCA.prototype.connect = function(node) {
      if (node.hasOwnProperty('input')) {
        this.output.connect(node.input);
      } else {
        this.output.connect(node);
      };
    }

    return VCA;
  })(context);

  var EnvelopeGenerator = (function(context) {
    function EnvelopeGenerator() {
      var that = this;
      $(document).bind('gateOn', function (_) {
        that.attack();
      });
      $(document).bind('gateOff', function (_) {
        that.release();
      });
    };

    EnvelopeGenerator.prototype.attack = function() {
      now = context.currentTime;
      this.param.linearRampToValueAtTime(1, now + 0.01);
    };

    EnvelopeGenerator.prototype.release = function() {
      now = context.currentTime;
      this.param.linearRampToValueAtTime(0, now + 0.01);
    };

    EnvelopeGenerator.prototype.connect = function(param) {
      this.param = param;
    };

    return EnvelopeGenerator;
  })(context);

  var vco = new VCO;
  var vca = new VCA;
  var envelope = new EnvelopeGenerator;

  /* Connections */
  vco.connect(vca);
  envelope.connect(vca.amplitude);
  vca.connect(context.destination);

  var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
  }

  depressed_keys = {}

  keyboard.keyDown(function (note, frequency) {
    depressed_keys[note] = true;
    jQuery.event.trigger('frequency', [frequency] );
    jQuery.event.trigger('gateOn');
  });

  keyboard.keyUp(function (note, _) {
    delete depressed_keys[note];
    if (isEmpty(depressed_keys)) {
      jQuery.event.trigger('gateOff');
    }
  });
});
