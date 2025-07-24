import { Injectable, signal, WritableSignal } from '@angular/core';
import { z } from "zod";

const TOKEN_KEY = "token";

export const readToken = (): string | null => {
	return localStorage.getItem(TOKEN_KEY);
};

export const writeToken = (token: string): void => {
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
	readonly token: WritableSignal<string | undefined> = signal(undefined);

	writeToken(token: string): void {
		this.token.set(token);
		writeToken(token);
	}

	writeSession(session: SessionZ): void {
		this.writeToken(session.token);
	}
}
