/*
 * While in local development, make sure you've run `pnpm run build` first.
 */

import { concurrently } from './dist/src/index.js';

// NOTE: the star reexport doesn't work in Node <12.20, <14.13 and <15.
export * from './dist/src/index.js';

export default concurrently;
ts = await toStats(dir);

	if (!stats.isDirectory()) {
		dir = dirname(dir);
	}

	while (true) {
		tmp = await callback(dir, await toRead(dir));
		if (tmp) return resolve(dir, tmp);
		dir = dirname(tmp = dir);
		if (tmp === dir) break;
	}
}
