'use strict';

exports.isInteger = num => {
  if (typeof num === 'number') {
    return Number.isInteger(num);
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isInteger(Number(num));
  }
  return false;
};

/**
 * Find a node of the given type
 */

exports.find = (node, type) => node.nodes.find(node => node.type === type);

/**
 * Find a node of the given type
 */

exports.exceedsLimit = (min, max, step = 1, limit) => {
  if (limit === false) return false;
  if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
  return ((Number(max) - Number(min)) / Number(step)) >= limit;
};

/**
 * Escape the given node with '\\' before node.value
 */

exports.escapeNode = (block, n = 0, type) => {
  const node = block.nodes[n];
  if (!node) return;

  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
    if (node.escaped !== true) {
      node.value = '\\' + node.value;
      node.escaped = true;
    }
  }
};

/**
 * Returns true if the given brace node should be enclosed in literal braces
 */

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a brace node is invalid.
 */

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
    block.invalid = true;
    return true;
  }
  if (block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a node is an open or close node
 */

exports.isOpenOrClose = node => {
  if (node.type === 'open' || node.type === 'close') {
    return true;
  }
  return node.open === true || node.close === true;
};

/**
 * Reduce an array of text nodes.
 */

exports.reduce = nodes => nodes.reduce((acc, node) => {
  if (node.type === 'text') acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

/**
 * Flatten an array
 */

exports.flatten = (...args) => {
  const result = [];

  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      const ele = arr[i];

      if (Array.isArray(ele)) {
        flat(ele);
        continue;
      }

      if (ele !== undefined) {
        result.push(ele);
      }
    }
    return result;
  };

  flat(args);
  return result;
};
   escaping = true;
          }
          continue;
        }
        if (code === 34/* '"' */) {
          if (escaping) {
            valueStart = i;
            escaping = false;
            continue;
          }
          value += str.slice(valueStart, i);
          break;
        }
        if (escaping) {
          valueStart = i - 1;
          escaping = false;
        }
        // Invalid unescaped quoted character (malformed)
        if (QDTEXT[code] !== 1)
          return;
      }

      // No end quote (malformed)
      if (i === str.length)
        return;

      ++i; // Skip over double quote
    } else {
      valueStart = i;
      // Parse unquoted value
      for (; i < str.length; ++i) {
        const code = str.charCodeAt(i);
        if (TOKEN[code] !== 1) {
          // No value (malformed)
          if (i === valueStart)
            return;
          break;
        }
      }
      value = str.slice(valueStart, i);
    }

    name = name.toLowerCase();
    if (params[name] === undefined)
      params[name] = value;
  }

  return params;
}

function parseDisposition(str, defDecoder) {
  if (str.length === 0)
    return;

  const params = Object.create(null);
  let i = 0;

  for (; i < str.length; ++i) {
    const code = str.charCodeAt(i);
    if (TOKEN[code] !== 1) {
      if (parseDispositionParams(str, i, params, defDecoder) === undefined)
        return;
      break;
    }
  }

  const type = str.slice(0, i).toLowerCase();

  return { type, params };
}

function parseDispositionParams(str, i, params, defDecoder) {
  while (i < str.length) {
    // Consume whitespace
    for (; i < str.length; ++i) {
      const code = str.charCodeAt(i);
      if (code !== 32/* ' ' */ && code !== 9/* '\t' */)
        break;
    }

    // Ended on whitespace
    if (i === str.length)
      break;

    // Check for malformed parameter
    if (str.charCodeAt(i++) !== 59/* ';' */)
      return;

    // Consume whitespace
    for (; i < str.length; ++i) {
      const code = str.charCodeAt(i);
      if (code !== 32/* ' ' */ && code !== 9/* '\t' */)
        break;
    }

    // Ended on whitespace (malformed)
    if (i === str.length)
      return;

    let name;
    const nameStart = i;
    // Parse parameter name
    for (; i < str.length; ++i) {
      const code = str.charCodeAt(i);
      if (TOKEN[code] !== 1) {
        if (code === 61/* '=' */)
          break;
        return;
      }
    }

    // No value (malformed)
    if (i === str.length)
      return;

    let value = '';
    let valueStart;
    let charset;
    //~ let lang;
    name = str.slice(nameStart, i);
    if (name.charCodeAt(name.length - 1) === 42/* '*' */) {
      // Extended value

      const charsetStart = ++i;
      // Parse charset name
      for (; i < str.length; ++i) {
        const code = str.charCodeAt(i);
        if (CHARSET[code] !== 1) {
          if (code !== 39/* '\'' */)
            return;
          break;
        }
      }

      // Incomplete charset (malformed)
      if (i === str.length)
        return;

      charset = str.slice(charsetStart, i);
      ++i; // Skip over the '\''

      //~ const langStart = ++i;
      // Parse language name
      for (; i < str.length; ++i) {
        const code = str.charCodeAt(i);
        if (code === 39/* '\'' */)
          break;
      }

      // Incomplete language (malformed)
      if (i === str.length)
        return;

      //~ lang = str.slice(langStart, i);
      ++i; // Skip over the '\''

      // No value (malformed)
      if (i === str.length)
        return;

      valueStart = i;

      let encode = 0;
      // Parse value
      for (; i < str.length; ++i) {
        const code = str.charCodeAt(i);
        if (EXTENDED_VALUE[code] !== 1) {
          if (code === 37/* '%' */) {
            let hexUpper;
            let hexLower;
            if (i + 2 < str.length
                && (hexUpper = HEX_VALUES[str.charCodeAt(i + 1)]) !== -1
                && (hexLower = HEX_VALUES[str.charCodeAt(i + 2)]) !== -1) {
              const byteVal = (hexUpper << 4) + hexLower;
              value += str.slice(valueStart, i);
              value += String.fromCharCode(byteVal);
              i += 2;
              valueStart = i + 1;
              if (byteVal >= 128)
                encode = 2;
              else if (encode === 0)
                encode = 1;
              continue;
            }
            // '%' disallowed in non-percent encoded contexts (malformed)
            return;
          }
          break;
        }
      }

      value += str.slice(valueStart, i);
      value = convertToUTF8(value, charset, encode);
      if (value === undefined)
        return;
    } else {
      // Non-extended value

      ++i; // Skip over '='

      // No value (malformed)
      if (i === str.length)
        return;

      if (str.charCodeAt(i) === 34/* '"' */) {
        valueStart = ++i;
        let escaping = false;
        // Parse quoted value
        for (; i < str.length; ++i) {
          const code = str.charCodeAt(i);
          if (code === 92/* '\\' */) {
            if (escaping) {
              valueStart = i;
              escaping = false;
            } else {
              value += str.slice(valueStart, i);
              escaping = true;
            }
            continue;
          }
          if (code === 34/* '"' */) {
            if (escaping) {
              valueStart = i;
              escaping = false;
              continue;
            }
            value += str.slice(valueStart, i);
            break;
          }
          if (escaping) {
            valueStart = i - 1;
            escaping = false;
          }
          // Invalid unescaped quoted character (malformed)
          if (QDTEXT[code] !== 1)
            return;
        }

        // No end quote (malformed)
        if (i === str.length)
          return;

        ++i; // Skip over double quote
      } else {
        valueStart = i;
        // Parse unquoted value
        for (; i < str.length; ++i) {
          const code = str.charCodeAt(i);
          if (TOKEN[code] !== 1) {
            // No value (malformed)
            if (i === valueStart)
              return;
            break;
          }
        }
        value = str.slice(valueStart, i);
      }

      value = defDecoder(value, 2);
      if (value === undefined)
        return;
    }

    name = name.toLowerCase();
    if (params[name] === undefined)
      params[name] = value;
  }

  return params;
}

function getDecoder(charset) {
  let lc;
  while (true) {
    switch (charset) {
      case 'utf-8':
      case 'utf8':
        return decoders.utf8;
      case 'latin1':
      case 'ascii': // TODO: Make these a separate, strict decoder?
      case 'us-ascii':
      case 'iso-8859-1':
      case 'iso8859-1':
      case 'iso88591':
      case 'iso_8859-1':
      case 'windows-1252':
      case 'iso_8859-1:1987':
      case 'cp1252':
      case 'x-cp1252':
        return decoders.latin1;
      case 'utf16le':
      case 'utf-16le':
      case 'ucs2':
      case 'ucs-2':
        return decoders.utf16le;
      case 'base64':
        return decoders.base64;
      default:
        if (lc === undefined) {
          lc = true;
          charset = charset.toLowerCase();
          continue;
        }
        return decoders.other.bind(charset);
    }
  }
}

const decoders = {
  utf8: (data, hint) => {
    if (data.length === 0)
      return '';
    if (typeof data === 'string') {
      // If `data` never had any percent-encoded bytes or never had any that
      // were outside of the ASCII range, then we can safely just return the
      // input since UTF-8 is ASCII compatible
      if (hint < 2)
        return data;

      data = Buffer.from(data, 'latin1');
    }
    return data.utf8Slice(0, data.length);
  },

  latin1: (data, hint) => {
    if (data.length === 0)
      return '';
    if (typeof data === 'string')
      return data;
    return data.latin1Slice(0, data.length);
  },

  utf16le: (data, hint) => {
    if (data.length === 0)
      return '';
    if (typeof data === 'string')
      data = Buffer.from(data, 'latin1');
    return data.ucs2Slice(0, data.length);
  },

  base64: (data, hint) => {
    if (data.length === 0)
      return '';
    if (typeof data === 'string')
      data = Buffer.from(data, 'latin1');
    return data.base64Slice(0, data.length);
  },

  other: (data, hint) => {
    if (data.length === 0)
      return '';
    if (typeof data === 'string')
      data = Buffer.from(data, 'latin1');
    try {
      const decoder = new TextDecoder(this);
      return decoder.decode(data);
    } catch {}
  },
};

function convertToUTF8(data, charset, hint) {
  const decode = getDecoder(charset);
  if (decode)
    return decode(data, hint);
}

function basename(path) {
  if (typeof path !== 'string')
    return '';
  for (let i = path.length - 1; i >= 0; --i) {
    switch (path.charCodeAt(i)) {
      case 0x2F: // '/'
      case 0x5C: // '\'
        path = path.slice(i + 1);
        return (path === '..' || path === '.' ? '' : path);
    }
  }
  return (path === '..' || path === '.' ? '' : path);
}

const TOKEN = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const QDTEXT = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

const CHARSET = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const EXTENDED_VALUE = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

/* eslint-disable no-multi-spaces */
const HEX_VALUES = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
   0,  1,  2,  3,  4,  5,  6,  7,  8,  9, -1, -1, -1, -1, -1, -1,
  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
];
/* eslint-enable no-multi-spaces */

module.exports = {
  basename,
  convertToUTF8,
  getDecoder,
  parseContentType,
  parseDisposition,
};
