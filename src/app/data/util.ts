export const emptyToNull = (xs: string): string | null => {
	if (xs === undefined || xs === "") {
		return null;
	}
	return xs;
};
