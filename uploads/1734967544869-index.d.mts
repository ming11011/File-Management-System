export type Callback = (
	directory: string,
	files: string[],
) => string | false | void;

export default function (
	directory: string,
	callback: Callback,
): string | void;
y: string,
	callback: Callback,
): Promise<string | void>;
