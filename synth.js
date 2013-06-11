$(function () {
  var context = new AudioContext();

  var keyboard = qwertyHancock({id: 'keyboard'});

  var Voice = (function(context) {
    function Voice(frequency){
      this.frequency = frequency;
      this.oscillators = [];
    };

    Voice.prototype.start = function() {
      /* VCO */
      var vco = context.createOscillator();
      vco.type = vco.SINE;
      vco.frequency.value = this.frequency;

      /* VCA */
      var vca = context.createGain();
      vca.gain.value = 0.3;

      /* connections */
      vco.connect(vca);
      vca.connect(context.destination);

      vco.start(0);

      /* Keep track of the oscillators used */
      this.oscillators.push(vco);
    };

    Voice.prototype.stop = function() {
      jQuery.each(this.oscillators, function(_, oscillator) {
        oscillator.stop(0);
      });
    };

    return Voice;
  })(context);

  active_voices = {};

  keyboard.keyDown(function (note, frequency) {
    var voice = new Voice(frequency);
    active_voices[note] = voice;
    voice.start();
  });

  keyboard.keyUp(function (note, _) {
    active_voices[note].stop();
    delete active_voices[note];
  });
});
