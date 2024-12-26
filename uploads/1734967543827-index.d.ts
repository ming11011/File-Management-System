/**
 * Kills process identified by `pid` and all its children
 *
 * @param pid
 * @param signal 'SIGTERM' by default
 * @param callback
 */
declare function treeKill(pid: number, callback?: (error?: Error) => void): void;
declare function treeKill(pid: number, signal?: string | number, callback?: (error?: Error) => void): void;

declare namespace treeKill {}

export = treeKill;
d,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __createBinding,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
} from '../tslib.js';
export * as default from '../tslib.js';
