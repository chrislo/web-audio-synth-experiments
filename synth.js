$(function () {
  var context = new AudioContext();

  var keyboard = qwertyHancock({id: 'keyboard'});

  var Voice = (function(context) {
    function Voice(frequency){
      this.frequency = frequency;
      this.nodes = [];
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

      /* Keep track of the nodes used */
      this.nodes.push(vco);
      this.nodes.push(vca);
    };

    Voice.prototype.stop = function() {
      jQuery.each(this.nodes, function(_, node) {
        node.disconnect();
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
