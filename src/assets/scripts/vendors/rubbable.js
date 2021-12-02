import SuperGif from './supergif';

export default function RubbableGif (options) {
  const configuredSuperGif = SuperGif();
  var sup = new configuredSuperGif(options);

  var register_canvas_handers = function () {

    var isvp = function (x) {
      return (options.vp_l ? (x - options.vp_l) : x);
    }

    var canvas = sup.get_canvas();
    var maxTime = 1000,
      // allow movement if < 1000 ms (1 sec)
      w = (options.vp_w ? options.vp_w : canvas.width),
      maxDistance = Math.floor(w / (sup.get_length() * 2)),
      // swipe movement of 50 pixels triggers the swipe
      startX = 0,
      startTime = 0;

    var cantouch = "ontouchend" in document;

    var aj = 0;
    var last_played = 0;

    canvas.addEventListener((cantouch) ? 'touchstart' : 'mousedown', function (e) {
      // prevent image drag (Firefox)
      e.preventDefault();
      if (sup.get_auto_play()) sup.pause();

      var pos = (e.touches && e.touches.length > 0) ? e.touches[0] : e;

      var x = (pos.layerX > 0) ? isvp(pos.layerX) : w / 2;
      var progress = x / w;

      sup.move_to(Math.floor(progress * (sup.get_length() - 1)));

      startTime = e.timeStamp;
      startX = isvp(pos.pageX);
    });

    canvas.addEventListener((cantouch) ? 'touchend' : 'mouseup', function (e) {
      startTime = 0;
      startX = 0;
      if (sup.get_auto_play()) sup.play();
    });

    canvas.addEventListener((cantouch) ? 'touchmove' : 'mousemove', function (e) {
      e.preventDefault();
      var pos = (e.touches && e.touches.length > 0) ? e.touches[0] : e;

      var currentX = isvp(pos.pageX);
      currentDistance = (startX === 0) ? 0 : Math.abs(currentX - startX);
      // allow if movement < 1 sec
      currentTime = e.timeStamp;
      if (startTime !== 0 && currentDistance > maxDistance) {
        if (currentX < startX && sup.get_current_frame() > 0) {
          sup.move_relative(-1);
        }
        if (currentX > startX && sup.get_current_frame() < sup.get_length() - 1) {
          sup.move_relative(1);
        }
        startTime = e.timeStamp;
        startX = isvp(pos.pageX);
      }

      var time_since_last_play = e.timeStamp - last_played; {
        aj++;
        if (document.getElementById('tickles' + ((aj % 5) + 1))) document.getElementById('tickles' + ((aj % 5) + 1)).play();
        last_played = e.timeStamp;
      }


    });
  };

  sup.orig_load = sup.load;
  sup.load = function (callback) {
    sup.orig_load(function () {
      if (callback) callback();
      register_canvas_handers(sup);
    });
  }

  return sup;
};
