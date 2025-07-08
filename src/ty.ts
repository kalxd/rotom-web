import * as C from "drifloon/codec";

export const userC = C.Codec.interface({
	id: C.number,
	username: C.string
});

export type UserC = C.GetType<typeof userC>;
