import * as C from "drifloon/codec";

export const userC = C.Codec.interface({
	id: C.number,
	username: C.string
});

export type UserC = C.GetType<typeof userC>;

export const sessionUserC = C.Codec.interface({
	token: C.string,
	user: userC
});

export type SessionUserC = C.GetType<typeof sessionUserC>;
