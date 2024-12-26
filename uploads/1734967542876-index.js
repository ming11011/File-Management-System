'use strict';

const SqlString = require('sqlstring');

const ConnectionConfig = require('./lib/connection_config.js');
const parserCache = require('./lib/parsers/parser_cache.js');

const Connection = require('./lib/connection.js');

exports.createConnection = require('./lib/create_connection.js');
exports.connect = exports.createConnection;
exports.Connection = Connection;
exports.ConnectionConfig = ConnectionConfig;

const Pool = require('./lib/pool.js');
const PoolCluster = require('./lib/pool_cluster.js');
const createPool = require('./lib/create_pool.js');
const createPoolCluster = require('./lib/create_pool_cluster.js');

exports.createPool = createPool;

exports.createPoolCluster = createPoolCluster;

exports.createQuery = Connection.createQuery;

exports.Pool = Pool;

exports.PoolCluster = PoolCluster;

exports.createServer = function (handler) {
  const Server = require('./lib/server.js');
  const s = new Server();
  if (handler) {
    s.on('connection', handler);
  }
  return s;
};

exports.PoolConnection = require('./lib/pool_connection.js');
exports.authPlugins = require('./lib/auth_plugins');
exports.escape = SqlString.escape;
exports.escapeId = SqlString.escapeId;
exports.format = SqlString.format;
exports.raw = SqlString.raw;

exports.__defineGetter__(
  'createConnectionPromise',
  () => require('./promise.js').createConnection,
);

exports.__defineGetter__(
  'createPoolPromise',
  () => require('./promise.js').createPool,
);

exports.__defineGetter__(
  'createPoolClusterPromise',
  () => require('./promise.js').createPoolCluster,
);

exports.__defineGetter__('Types', () => require('./lib/constants/types.js'));

exports.__defineGetter__('Charsets', () =>
  require('./lib/constants/charsets.js'),
);

exports.__defineGetter__('CharsetToEncoding', () =>
  require('./lib/constants/charset_encodings.js'),
);

exports.setMaxParserCache = function (max) {
  parserCache.setMaxCache(max);
};

exports.clearParserCache = function () {
  parserCache.clearCache();
};
g.cache !== false && !cache) {
    cache = new (require('lru-cache'))({ max: ncache });
  }

  function toArrayParams(tree, params) {
    const arr = [];
    if (tree.length == 1) {
      return [tree[0], []];
    }

    if (typeof params == 'undefined')
      throw new Error('Named query contains placeholders, but parameters object is undefined');

    const tokens = tree[1];
    for (let i=0; i < tokens.length; ++i) {
      arr.push(params[tokens[i]]);
    }
    return [tree[0], arr];
  }

  function noTailingSemicolon(s) {
    if (s.slice(-1) == ':') {
      return s.slice(0, -1);
    }
    return s;
  }

  function join(tree) {
    if (tree.length == 1) {
      return tree;
    }

    let unnamed = noTailingSemicolon(tree[0][0]);
    for (let i=1; i < tree[0].length; ++i) {
      if (tree[0][i-1].slice(-1) == ':') {
        unnamed += config.placeholder;
      }
      unnamed += config.placeholder;
      unnamed += noTailingSemicolon(tree[0][i]);
    }

    const last = tree[0][tree[0].length -1];
    if (tree[0].length == tree[1].length) {
      if (last.slice(-1) == ':') {
        unnamed += config.placeholder;
      }
      unnamed += config.placeholder;
    }
    return [unnamed, tree[1]];
  }

  function compile(query, paramsObj) {
    let tree;
    if (cache && (tree = cache.get(query))) {
      return toArrayParams(tree, paramsObj)
    }
    tree = join(parse(query));
    if(cache) {
      cache.set(query, tree);
    }
    return toArrayParams(tree, paramsObj);
  }

  compile.parse = parse;
  return compile;
}

// named :one :two to postgres-style numbered $1 $2 $3
function toNumbered(q, params) {
  const tree = parse(q);
  const paramsArr = [];
  if (tree.length == 1) {
    return [tree[0], paramsArr];
  }

  const pIndexes = {};
  let pLastIndex = 0;
  let qs = '';
  let varIndex;
  const varNames = [];
  for (let i=0; i < tree[0].length; ++i) {
    varIndex = pIndexes[tree[1][i]];
    if (!varIndex) {
      varIndex = ++pLastIndex;
      pIndexes[tree[1][i]] = varIndex;
    }
    if (tree[1][i]) {
      varNames[varIndex - 1] = tree[1][i];
      qs += tree[0][i] + '$' + varIndex;
    } else {
      qs += tree[0][i];
    }
  }
  return [qs, varNames.map(n => params[n])];
}

module.exports = createCompiler;
module.exports.toNumbered = toNumbered;
