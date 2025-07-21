import { Either, EitherAsync, Left } from "drifloon/purify";
import * as C from "drifloon/codec";

let memToken: string | undefined = undefined; // 全局token。

const errorC = C.Codec.interface({
	msg: C.string
});

const catchAnyError = (e: unknown): string => {
	if (e instanceof Error) {
		return e.message;
	}

	return `${e}`;
};

export const setToken = (token: string): void => {
	memToken = token;
};

const makeFetch = async <T>(
	endpoint: string,
	codec: C.Codec<T>,
	partialInit: RequestInit,
): Promise<Either<string, T>> => {
	const init: RequestInit = {
		headers: {
			xgtoken: memToken ?? ""
		},
		...partialInit
	};

	try {
		const rsp = await fetch(`./api${endpoint}`, init)
		if (rsp.status === 200 || rsp.status === 300) {
			const json = await rsp.json();
			return codec.decode(json).mapLeft(catchAnyError);
		}

		const json = await rsp.json();
		return errorC.decode(json)
			.chain(x => Left(x.msg));
	}
	catch (e) {
		return Left(catchAnyError(e));
	}
};

export const makeGet = <T>(
	endpoint: string,
	codec: C.Codec<T>
): EitherAsync<string, T> => {
	return EitherAsync.fromPromise(() => {
		return makeFetch(endpoint, codec, {});
	});
};

export const makePost = <T>(
	endpoint: string,
	codec: C.Codec<T>
): EitherAsync<string, T> => {
	return EitherAsync.fromPromise(() => {
		return makeFetch(endpoint, codec, {
			method: "POST"
		});
	});
};
