$(function () {
  var context = new AudioContext();

  var keyboard = qwertyHancock({id: 'keyboard'});

  var Voice = (function(context) {
    function Voice(frequency){
      this.frequency = frequency;
    };

    Voice.prototype.trigger = function() {
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
    };

    return Voice;
  })(context);

  keyboard.keyDown(function (_, frequency) {
    var voice = new Voice(frequency);
    voice.trigger()
  });

  keyboard.keyUp(function (note, _) {
  });
});
