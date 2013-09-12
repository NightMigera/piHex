/**
 * Created with JetBrains WebStorm.
 * User: louter
 * Date: 12.09.13
 * Time: 17:49
 */
(function(window){
  "use strict";
  var ihex;
  var NTP = 25;
  var buffer = new ArrayBuffer(1024*1024*8);

  var series = (function (stdlib, env, heap) {
    "use asm";
    var floor = stdlib.Math.floor;
    var pow = stdlib.Math.pow;
    var tp1 = 0;
    var tp = new stdlib.Float64Array(heap);
    var ntp = env.NTP|0;

    function expm ( p, ak ) {
      p = +p;
      ak = +ak;
      var i = 0;
      var j = 0;
      var p1 = 0.0;
      var pt = 0.0;
      var r = 0.0; // float as double
      var di = 0;
      var dd = 0.0;
      i = i|0;
      j = j|0;
      ntp = ntp|0;

      if ((tp1|0) == 0) {
        tp1 = 1|0;
        tp[0] = +1;
        for (i = 1; (i|0) < (ntp|0); i = (i|0) + 1|0) {
          tp[((i|0)<<3)>>3] =
            +(+2 * tp[(((i-1)|0)<<3)>>3]);
        }
      }
      if (+ak == 1.0) {
        return +0;
      }
      for (i = 0; (i|0) < (ntp|0); i = (i|0) + 1|0) {
        if (+tp[(i|0)<<3>>3] > p) {
          break;
        }
      }
      pt = +tp[((i-1)|0)<<3>>3];
      p1 = +p;
      r = +1;
      for (j = 0; (j|0) <= (i|0); j = (j|0) + 1|0) {
        if (p1 >= pt){
          r = +16 * r;
          r = r - (+(floor(r / ak))) * ak;
          p1 = p1 - pt;
        }
        pt = 0.5 * pt;
        if (pt >= 1.){
          r = r * r;
          r = r - (+(floor(r / ak))) * ak;
        }
      }

      return +r;
    }
    function series (m, id) {
      m = m|0;
      id = id|0;
      var k = 0;
      var ak = 0.0;
      var eps = 0.0;
      var p = 0.0;
      var s = 0.0;
      var t = 0.0;
      eps = 0.00000000000000001;
      k = 0|0;
      for (k; (k|0) < (id|0); k = (k|0) + 1|0){
        ak = +8 * (+(k|0)) + (+(m|0));
        p = (+(id|0) - +(k|0));
        t = +expm(p, ak);
        s = s + t / ak;
        s = s - floor(s);
      }
      for (k = (id|0); (k|0) <= ((id + 100)|0); k = (k|0) + 1|0){
        ak = +8 * (+(k|0)) + (+(m|0));
        t = pow(+16, +(id|0) - (+(k|0))) / +ak;
        if (t < eps) break;
        s = s + t;
        s = s - floor(s);
      }
      return +s;
    }

    return series;
  })(
    {
      Uint8Array: Uint8Array,
      Int8Array: Int8Array,
      Uint16Array: Uint16Array,
      Int16Array: Int16Array,
      Uint32Array: Uint32Array,
      Int32Array: Int32Array,
      Float32Array: Float32Array,
      Float64Array: Float64Array,
      Math: Math
    },
    {
      NTP: NTP
    },
    buffer
  );
  ihex = function (x, nhx, chx) {
    var i, y, hx = "0123456789ABCDEF";

    y = Math.abs(x);
    for (i = 0; i < nhx; i++){
      y = 16. * (y - (y|0));
      chx[i] = hx[y|0];
    }
  };
  window.pi = function (id) {
    var pid, s1, s2, s3, s4
      , hex = [];
    s1 = series (1, id);
    s2 = series (4, id);
    s3 = series (5, id);
    s4 = series (6, id);
    pid = 4 * s1 - 2 * s2 - s3 - s4;
    pid = pid - (pid|0) + 1;
    ihex (pid, 16, hex);

    return {
      hex: hex.join('').substr(0, 10),
      fraction: pid
    };
  };
})(window);
