'use strict';

var test = require('tape');
var parse = require('../').parse;

test('parse shell commands', function (t) {
	t.same(parse(''), [], 'parses an empty string');

	t['throws'](
		function () { parse('${}'); },
		Error,
		'empty substitution throws'
	);
	t['throws'](
		function () { parse('${'); },
		Error,
		'incomplete substitution throws'
	);

	t.same(parse('a \'b\' "c"'), ['a', 'b', 'c']);
	t.same(
		parse('beep "boop" \'foo bar baz\' "it\'s \\"so\\" groovy"'),
		['beep', 'boop', 'foo bar baz', 'it\'s "so" groovy']
	);
	t.same(parse('a b\\ c d'), ['a', 'b c', 'd']);
	t.same(parse('\\$beep bo\\`op'), ['$beep', 'bo`op']);
	t.same(parse('echo "foo = \\"foo\\""'), ['echo', 'foo = "foo"']);
	t.same(parse(''), []);
	t.same(parse(' '), []);
	t.same(parse('\t'), []);
	t.same(parse('a"b c d"e'), ['ab c de']);
	t.same(parse('a\\ b"c d"\\ e f'), ['a bc d e', 'f']);
	t.same(parse('a\\ b"c d"\\ e\'f g\' h'), ['a bc d ef g', 'h']);
	t.same(parse("x \"bl'a\"'h'"), ['x', "bl'ah"]);
	t.same(parse("x bl^'a^'h'", {}, { escape: '^' }), ['x', "bl'a'h"]);
	t.same(parse('abcH def', {}, { escape: 'H' }), ['abc def']);

	t.deepEqual(parse('# abc  def  ghi'), [{ comment: ' abc  def  ghi' }], 'start-of-line comment content is unparsed');
	t.deepEqual(parse('xyz # abc  def  ghi'), ['xyz', { comment: ' abc  def  ghi' }], 'comment content is unparsed');

	t.deepEqual(parse('-x "" -y'), ['-x', '', '-y'], 'empty string is preserved');

	t.end();
});
ROL + ')', // control chars
		'(' + BAREWORD + '|' + SINGLE_QUOTE + '|' + DOUBLE_QUOTE + ')+'
	].join('|'), 'g');

	var matches = matchAll(string, chunker);

	if (matches.length === 0) {
		return [];
	}
	if (!env) {
		env = {};
	}

	var commented = false;

	return matches.map(function (match) {
		var s = match[0];
		if (!s || commented) {
			return void undefined;
		}
		if (controlRE.test(s)) {
			return { op: s };
		}

		// Hand-written scanner/parser for Bash quoting rules:
		//
		// 1. inside single quotes, all characters are printed literally.
		// 2. inside double quotes, all characters are printed literally
		//    except variables prefixed by '$' and backslashes followed by
		//    either a double quote or another backslash.
		// 3. outside of any quotes, backslashes are treated as escape
		//    characters and not printed (unless they are themselves escaped)
		// 4. quote context can switch mid-token if there is no whitespace
		//     between the two quote contexts (e.g. all'one'"token" parses as
		//     "allonetoken")
		var quote = false;
		var esc = false;
		var out = '';
		var isGlob = false;
		var i;

		function parseEnvVar() {
			i += 1;
			var varend;
			var varname;
			var char = s.charAt(i);

			if (char === '{') {
				i += 1;
				if (s.charAt(i) === '}') {
					throw new Error('Bad substitution: ' + s.slice(i - 2, i + 1));
				}
				varend = s.indexOf('}', i);
				if (varend < 0) {
					throw new Error('Bad substitution: ' + s.slice(i));
				}
				varname = s.slice(i, varend);
				i = varend;
			} else if ((/[*@#?$!_-]/).test(char)) {
				varname = char;
				i += 1;
			} else {
				var slicedFromI = s.slice(i);
				varend = slicedFromI.match(/[^\w\d_]/);
				if (!varend) {
					varname = slicedFromI;
					i = s.length;
				} else {
					varname = slicedFromI.slice(0, varend.index);
					i += varend.index - 1;
				}
			}
			return getVar(env, '', varname);
		}

		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			isGlob = isGlob || (!quote && (c === '*' || c === '?'));
			if (esc) {
				out += c;
				esc = false;
			} else if (quote) {
				if (c === quote) {
					quote = false;
				} else if (quote == SQ) {
					out += c;
				} else { // Double quote
					if (c === BS) {
						i += 1;
						c = s.charAt(i);
						if (c === DQ || c === BS || c === DS) {
							out += c;
						} else {
							out += BS + c;
						}
					} else if (c === DS) {
						out += parseEnvVar();
					} else {
						out += c;
					}
				}
			} else if (c === DQ || c === SQ) {
				quote = c;
			} else if (controlRE.test(c)) {
				return { op: s };
			} else if (hash.test(c)) {
				commented = true;
				var commentObj = { comment: string.slice(match.index + i + 1) };
				if (out.length) {
					return [out, commentObj];
				}
				return [commentObj];
			} else if (c === BS) {
				esc = true;
			} else if (c === DS) {
				out += parseEnvVar();
			} else {
				out += c;
			}
		}

		if (isGlob) {
			return { op: 'glob', pattern: out };
		}

		return out;
	}).reduce(function (prev, arg) { // finalize parsed arguments
		// TODO: replace this whole reduce with a concat
		return typeof arg === 'undefined' ? prev : prev.concat(arg);
	}, []);
}

module.exports = function parse(s, env, opts) {
	var mapped = parseInternal(s, env, opts);
	if (typeof env !== 'function') {
		return mapped;
	}
	return mapped.reduce(function (acc, s) {
		if (typeof s === 'object') {
			return acc.concat(s);
		}
		var xs = s.split(RegExp('(' + TOKEN + '.*?' + TOKEN + ')', 'g'));
		if (xs.length === 1) {
			return acc.concat(xs[0]);
		}
		return acc.concat(xs.filter(Boolean).map(function (x) {
			if (startsWithToken.test(x)) {
				return JSON.parse(x.split(TOKEN)[1]);
			}
			return x;
		}));
	}, []);
};
