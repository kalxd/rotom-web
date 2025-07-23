import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as R from "rxjs";
import { z } from "zod";
import { readToken, Session, sessionZ, SessionZ } from './session';

@Injectable({
	providedIn: 'root'
})
export class Http {
	private readonly http = inject(HttpClient);
	private readonly session = inject(Session);

	makeGet<R>(url: string, codec: z.ZodType<R>): Observable<R> {
		return this.http.get(url).pipe(R.map(x => codec.parse(x)))
	}

	makePost<T, R>(url: string, body: T | null, codec: z.ZodType<R>): Observable<R> {
		return this.http.post(url, body).pipe(R.map(x => codec.parse(x)));
	}

	initSession(): Observable<SessionZ | undefined> {
		const token = readToken();
		if (token === null) {
			return R.of(undefined);
		}

		return this.http
			.get("/user/self", { headers: { xgtoken: token }})
			.pipe(
				R.map(x => sessionZ.parse(x)),
				R.tap(x => this.session.writeSession(x))
			);
	}
}
