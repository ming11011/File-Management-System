declare namespace escalade {
	export type Callback = (
		directory: string,
		files: string[],
	) => string | false | void;
}

declare function escalade(
	directory: string,
	callback: escalade.Callback,
): string | void;

export = escalade;
e.Callback,
): Promise<string | void>;

export = escalade;
