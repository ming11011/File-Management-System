"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_js_1 = require("./profiles/ca/defaults.js");
const proxies_js_1 = require("./profiles/ca/proxies.js");
const proxyBundle = {
    ca: proxies_js_1.proxies,
};
const profiles = {
    ca: [...defaults_js_1.defaults, ...proxies_js_1.proxies],
};
module.exports = profiles;
module.exports.proxyBundle = proxyBundle;
module.exports.default = profiles;
 ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}
