/*!
 * fresh
 * Copyright(c) 2012 TJ Holowaychuk
 * Copyright(c) 2016-2017 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * RegExp to check for no-cache token in Cache-Control.
 * @private
 */

var CACHE_CONTROL_NO_CACHE_REGEXP = /(?:^|,)\s*?no-cache\s*?(?:,|$)/

/**
 * Module exports.
 * @public
 */

module.exports = fresh

/**
 * Check freshness of the response using request and response headers.
 *
 * @param {Object} reqHeaders
 * @param {Object} resHeaders
 * @return {Boolean}
 * @public
 */

function fresh (reqHeaders, resHeaders) {
  // fields
  var modifiedSince = reqHeaders['if-modified-since']
  var noneMatch = reqHeaders['if-none-match']

  // unconditional request
  if (!modifiedSince && !noneMatch) {
    return false
  }

  // Always return stale when Cache-Control: no-cache
  // to support end-to-end reload requests
  // https://tools.ietf.org/html/rfc2616#section-14.9.4
  var cacheControl = reqHeaders['cache-control']
  if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) {
    return false
  }

  // if-none-match
  if (noneMatch && noneMatch !== '*') {
    var etag = resHeaders['etag']

    if (!etag) {
      return false
    }

    var etagStale = true
    var matches = parseTokenList(noneMatch)
    for (var i = 0; i < matches.length; i++) {
      var match = matches[i]
      if (match === etag || match === 'W/' + etag || 'W/' + match === etag) {
        etagStale = false
        break
      }
    }

    if (etagStale) {
      return false
    }
  }

  // if-modified-since
  if (modifiedSince) {
    var lastModified = resHeaders['last-modified']
    var modifiedStale = !lastModified || !(parseHttpDate(lastModified) <= parseHttpDate(modifiedSince))

    if (modifiedStale) {
      return false
    }
  }

  return true
}

/**
 * Parse an HTTP Date into a number.
 *
 * @param {string} date
 * @private
 */

function parseHttpDate (date) {
  var timestamp = date && Date.parse(date)

  // istanbul ignore next: guard against date.js Date.parse patching
  return typeof timestamp === 'number'
    ? timestamp
    : NaN
}

/**
 * Parse a HTTP token list.
 *
 * @param {string} str
 * @private
 */

function parseTokenList (str) {
  var end = 0
  var list = []
  var start = 0

  // gather tokens
  for (var i = 0, len = str.length; i < len; i++) {
    switch (str.charCodeAt(i)) {
      case 0x20: /*   */
        if (start === end) {
          start = end = i + 1
        }
        break
      case 0x2c: /* , */
        list.push(str.substring(start, end))
        start = end = i + 1
        break
      default:
        end = i + 1
        break
    }
  }

  // final token
  list.push(str.substring(start, end))

  return list
}
     var thunkify = function (value) {
            return function () { return value; };
        };
        st.test('returns object value', function (sst) {
            var expectedReturnValue = [1, 2, 3];
            var Constructor = functionBind.call(thunkify(expectedReturnValue), null);
            var result = new Constructor();
            sst.equal(result, expectedReturnValue);
            sst.end();
        });

        st.test('does not return primitive value', function (sst) {
            var Constructor = functionBind.call(thunkify(42), null);
            var result = new Constructor();
            sst.notEqual(result, 42);
            sst.end();
        });

        st.test('object from bound constructor is instance of original and bound constructor', function (sst) {
            var A = function (x) {
                this.name = x || 'A';
            };
            var B = functionBind.call(A, null, 'B');

            var result = new B();
            sst.ok(result instanceof B, 'result is instance of bound constructor');
            sst.ok(result instanceof A, 'result is instance of original constructor');
            sst.end();
        });

        st.end();
    });

    t.end();
});

test('with a context', function (t) {
    t.test('with no bound arguments', function (st) {
        var args, context;
        var boundContext = {};
        var namespace = {
            func: functionBind.call(function () {
                args = Array.prototype.slice.call(arguments);
                context = this;
            }, boundContext)
        };
        namespace.func(1, 2, 3);
        st.equal(context, boundContext, 'binds a context properly');
        st.deepEqual(args, [1, 2, 3], 'supplies passed arguments');
        st.end();
    });

    t.test('with bound arguments', function (st) {
        var args, context;
        var boundContext = {};
        var namespace = {
            func: functionBind.call(function () {
                args = Array.prototype.slice.call(arguments);
                context = this;
            }, boundContext, 1, 2, 3)
        };
        namespace.func(4, 5, 6);
        st.equal(context, boundContext, 'binds a context properly');
        st.deepEqual(args, [1, 2, 3, 4, 5, 6], 'supplies bound and passed arguments');
        st.end();
    });

    t.test('returns properly', function (st) {
        var boundContext = {};
        var args;
        var namespace = {
            func: functionBind.call(function () {
                args = Array.prototype.slice.call(arguments);
                return this;
            }, boundContext)
        };
        var context = namespace.func(1, 2, 3);
        st.equal(context, boundContext, 'returned context is bound context');
        st.notEqual(context, getCurrentContext.call(), 'returned context is not lexical context');
        st.deepEqual(args, [1, 2, 3], 'passed arguments are correct');
        st.end();
    });

    t.test('returns properly with bound arguments', function (st) {
        var boundContext = {};
        var args;
        var namespace = {
            func: functionBind.call(function () {
                args = Array.prototype.slice.call(arguments);
                return this;
            }, boundContext, 1, 2, 3)
        };
        var context = namespace.func(4, 5, 6);
        st.equal(context, boundContext, 'returned context is bound context');
        st.notEqual(context, getCurrentContext.call(), 'returned context is not lexical context');
        st.deepEqual(args, [1, 2, 3, 4, 5, 6], 'passed arguments are correct');
        st.end();
    });

    t.test('passes the correct arguments when called as a constructor', function (st) {
        var expected = { name: 'Correct' };
        var namespace = {
            Func: functionBind.call(function (arg) {
                return arg;
            }, { name: 'Incorrect' })
        };
        var returned = new namespace.Func(expected);
        st.equal(returned, expected, 'returns the right arg when called as a constructor');
        st.end();
    });

    t.test('has the new instance\'s context when called as a constructor', function (st) {
        var actualContext;
        var expectedContext = { foo: 'bar' };
        var namespace = {
            Func: functionBind.call(function () {
                actualContext = this;
            }, expectedContext)
        };
        var result = new namespace.Func();
        st.equal(result instanceof namespace.Func, true);
        st.notEqual(actualContext, expectedContext);
        st.end();
    });

    t.end();
});

test('bound function length', function (t) {
    t.test('sets a correct length without thisArg', function (st) {
        var subject = functionBind.call(function (a, b, c) { return a + b + c; });
        st.equal(subject.length, 3);
        st.equal(subject(1, 2, 3), 6);
        st.end();
    });

    t.test('sets a correct length with thisArg', function (st) {
        var subject = functionBind.call(function (a, b, c) { return a + b + c; }, {});
        st.equal(subject.length, 3);
        st.equal(subject(1, 2, 3), 6);
        st.end();
    });

    t.test('sets a correct length without thisArg and first argument', function (st) {
        var subject = functionBind.call(function (a, b, c) { return a + b + c; }, undefined, 1);
        st.equal(subject.length, 2);
        st.equal(subject(2, 3), 6);
        st.end();
    });

    t.test('sets a correct length with thisArg and first argument', function (st) {
        var subject = functionBind.call(function (a, b, c) { return a + b + c; }, {}, 1);
        st.equal(subject.length, 2);
        st.equal(subject(2, 3), 6);
        st.end();
    });

    t.test('sets a correct length without thisArg and too many arguments', function (st) {
        var subject = functionBind.call(function (a, b, c) { return a + b + c; }, undefined, 1, 2, 3, 4);
        st.equal(subject.length, 0);
        st.equal(subject(), 6);
        st.end();
    });

    t.test('sets a correct length with thisArg and too many arguments', function (st) {
        var subject = functionBind.call(function (a, b, c) { return a + b + c; }, {}, 1, 2, 3, 4);
        st.equal(subject.length, 0);
        st.equal(subject(), 6);
        st.end();
    });
});
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('hasown');
var $concat = bind.call($call, Array.prototype.concat);
var $spliceApply = bind.call($apply, Array.prototype.splice);
var $replace = bind.call($call, String.prototype.replace);
var $strSlice = bind.call($call, String.prototype.slice);
var $exec = bind.call($call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};
