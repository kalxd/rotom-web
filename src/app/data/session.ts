import { Injectable } from '@angular/core';
import { z } from "zod";

const TOKEN_KEY = "token";

export const readToken = (): string | null => {
	return localStorage.getItem(TOKEN_KEY);
};

const writeToken = (token: string): void => {
	localStorage.setItem(TOKEN_KEY, token);
};

export const userZ = z.object({
	id: z.number(),
	username: z.string()
});

export type UserZ = z.infer<typeof userZ>;

export const sessionZ = z.object({
	token: z.string(),
	user: userZ
});

export type SessionZ = z.infer<typeof sessionZ>;

@Injectable({
	providedIn: 'root'
})
export class Session {
	session: SessionZ | undefined;

	writeSession(session: SessionZ): void {
		this.session = session;
		writeToken(session.token);
	}
}
