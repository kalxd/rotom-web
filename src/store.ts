import { Maybe } from "drifloon/purify";

export const readToken = (): Maybe<string> => {
	const rawData = localStorage.getItem("token");
	return Maybe.fromNullable(rawData);
};

export const writeToken = (token: string): void => {
	localStorage.setItem("token", token);
};
