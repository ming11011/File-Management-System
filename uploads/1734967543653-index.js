'use strict';

var test = require('tape');

var $Object = require('../');
var ToObject = require('..//ToObject');
var RequireObjectCoercible = require('..//RequireObjectCoercible');

test('errors', function (t) {
	t.equal($Object, Object);
	// @ts-expect-error
	t['throws'](function () { ToObject(null); }, TypeError);
	// @ts-expect-error
	t['throws'](function () { ToObject(undefined); }, TypeError);
	// @ts-expect-error
	t['throws'](function () { RequireObjectCoercible(null); }, TypeError);
	// @ts-expect-error
	t['throws'](function () { RequireObjectCoercible(undefined); }, TypeError);

	t.deepEqual(RequireObjectCoercible(true), true);
	t.deepEqual(ToObject(true), Object(true));

	var obj = {};
	t.equal(RequireObjectCoercible(obj), obj);
	t.equal(ToObject(obj), obj);

	t.end();
});
     case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}
