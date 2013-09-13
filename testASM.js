/**
 * Created with JetBrains WebStorm.
 * User: louter
 * Date: 12.09.13
 * Time: 17:49
 */
(function (window) {
  "use strict";
  var ihex; // вычисляет hex по нецелому числу
  var NTP = 25; // константа
  var buffer = new ArrayBuffer(1024 * 1024 * 8); // буфер для представления, взят с запасом

  var series = (function (stdlib, env, heap) {
    "use asm";
    var floor = stdlib.Math.floor;
    var pow = stdlib.Math.pow;
    var tp1 = 0;
    var tp = new stdlib.Float64Array(heap);
    var ntp = env.NTP | 0;

    // возведение 16 в степень p и получение модуля ak
    function expm(p, ak) {
      p = +p; // double
      ak = +ak; // double
      var i = 0; // int
      var j = 0; // int
      var p1 = 0.0; // double
      var pt = 0.0; // double
      var r = 0.0;  // double
      i = i | 0; // init
      j = j | 0; // init
      ntp = ntp | 0; // init

      if ((tp1 | 0) == 0) {
        tp1 = 1 | 0;
        tp[0] = +1;
        // for (i = 1; i < ntp; i++)
        for (i = 1; (i | 0) < (ntp | 0); i = (i | 0) + 1 | 0) {
          // tp[i] = 2 * tp[i - 1]
          tp[(i << 3) >> 3] = +(+2 * tp[((i - 1) << 3) >> 3]);
        }
      }
      if (ak == 1.0) {
        return +0;
      }
      // for (i = 0; i <ntp; i++)
      for (i = 0; (i | 0) < (ntp | 0); i = (i | 0) + 1 | 0) {
        // if (tp[i] > p) break;
        if (+tp[i << 3 >> 3] > p) {
          break;
        }
      }
      pt = +tp[(i - 1) << 3 >> 3];
      p1 = +p;
      r = +1;
      for (j = 0; (j | 0) <= (i | 0); j = (j | 0) + 1 | 0) {
        if (p1 >= pt) {
          r = +16 * r;
          r = r - (+(floor(r / ak))) * ak;
          p1 = p1 - pt;
        }
        pt = 0.5 * pt;
        if (pt >= 1.) {
          r = r * r;
          // js: r = r - floor(r / ak) * ak;
          // c:  r = r - (int)(r / ak) * ak
          r = r - (+(floor(r / ak))) * ak;
        }
      }

      return +r; // return double, as 'double expm (...'
    }

    function series(m, id) {
      m = m | 0;
      id = id | 0;
      var k = 0;
      var ak = 0.0;
      var eps = 0.0;
      var p = 0.0;
      var s = 0.0;
      var t = 0.0;
      eps = 0.00000000000000001; // 1e-17
      k = 0 | 0;
      for (k; (k | 0) < (id | 0); k = (k | 0) + 1 | 0) {
        ak = +8 * (+(k | 0)) + (+(m | 0));
        p = (+(id | 0) - +(k | 0));
        t = +expm(p, ak);
        s = s + t / ak;
        s = s - floor(s);
      }
      for (k = (id | 0); (k | 0) <= ((id + 100) | 0); k = (k | 0) + 1 | 0) {
        ak = +8 * (+(k | 0)) + (+(m | 0));
        t = pow(+16, +(id | 0) - (+(k | 0))) / +ak;
        if (t < eps) break;
        s = s + t;
        s = s - floor(s);
      }
      return +s;
    }

    return series;
  })(
    {
      Uint8Array:  Uint8Array,
      Int8Array:   Int8Array,
      Uint16Array: Uint16Array,
      Int16Array:  Int16Array,
      Uint32Array: Uint32Array,
      Int32Array:  Int32Array,
      Float32Array:Float32Array,
      Float64Array:Float64Array,
      Math:        Math
    },
    {
      NTP:NTP
    },
    buffer
  );
  // модуль series, самая долговязая функция
  var series2 = (function (stdlib, env, heap) {
    var floor = stdlib.Math.floor;
    var pow = stdlib.Math.pow;
    var tp1 = 0;
    var tp = new stdlib.Float64Array(heap);
    var ntp = env.NTP | 0;

    // возведение 16 в степень p и получение модуля ak
    function expm(p, ak) {
      p = +p; // double
      ak = +ak; // double
      var i = 0; // int
      var j = 0; // int
      var p1 = 0.0; // double
      var pt = 0.0; // double
      var r = 0.0;  // double
      i = i | 0; // init
      j = j | 0; // init
      ntp = ntp | 0; // init

      if ((tp1 | 0) == 0) {
        tp1 = 1 | 0;
        tp[0] = +1;
        // for (i = 1; i < ntp; i++)
        for (i = 1; (i | 0) < (ntp | 0); i = (i | 0) + 1 | 0) {
          // tp[i] = 2 * tp[i - 1]
          tp[(i << 3) >> 3] = +(+2 * tp[((i - 1) << 3) >> 3]);
        }
      }
      if (ak == 1.0) {
        return +0;
      }
      // for (i = 0; i <ntp; i++)
      for (i = 0; (i | 0) < (ntp | 0); i = (i | 0) + 1 | 0) {
        // if (tp[i] > p) break;
        if (+tp[i << 3 >> 3] > p) {
          break;
        }
      }
      pt = +tp[(i - 1) << 3 >> 3];
      p1 = +p;
      r = +1;
      for (j = 0; (j | 0) <= (i | 0); j = (j | 0) + 1 | 0) {
        if (p1 >= pt) {
          r = +16 * r;
          r = r - (+(floor(r / ak))) * ak;
          p1 = p1 - pt;
        }
        pt = 0.5 * pt;
        if (pt >= 1.) {
          r = r * r;
          // js: r = r - floor(r / ak) * ak;
          // c:  r = r - (int)(r / ak) * ak
          r = r - (+(floor(r / ak))) * ak;
        }
      }

      return +r; // return double, as 'double expm (...'
    }

    function series(m, id) {
      m = m | 0;
      id = id | 0;
      var k = 0;
      var ak = 0.0;
      var eps = 0.0;
      var p = 0.0;
      var s = 0.0;
      var t = 0.0;
      eps = 0.00000000000000001; // 1e-17
      k = 0 | 0;
      for (k; (k | 0) < (id | 0); k = (k | 0) + 1 | 0) {
        ak = +8 * (+(k | 0)) + (+(m | 0));
        p = (+(id | 0) - +(k | 0));
        t = +expm(p, ak);
        s = s + t / ak;
        s = s - floor(s);
      }
      for (k = (id | 0); (k | 0) <= ((id + 100) | 0); k = (k | 0) + 1 | 0) {
        ak = +8 * (+(k | 0)) + (+(m | 0));
        t = pow(+16, +(id | 0) - (+(k | 0))) / +ak;
        if (t < eps) break;
        s = s + t;
        s = s - floor(s);
      }
      return +s;
    }

    return series;
  })(
    {
      Uint8Array:  Uint8Array,
      Int8Array:   Int8Array,
      Uint16Array: Uint16Array,
      Int16Array:  Int16Array,
      Uint32Array: Uint32Array,
      Int32Array:  Int32Array,
      Float32Array:Float32Array,
      Float64Array:Float64Array,
      Math:        Math
    },
    {
      NTP:NTP
    },
    buffer
  );
  var t0, t1, t2;
  t0 = (new Date()).getTime();
  series(1, 30000);
  t1 = (new Date()).getTime();
  series2(1, 30000);
  t2 = (new Date()).getTime();
  window.asmjs = ((t1 - t0)/(t2 - t1) < 0.85);
})(window);
