import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as R from "rxjs";
import { z } from "zod";
import { readToken, Session, UserZ, userZ } from './session';

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

	initSession(): Observable<UserZ | null> {
		const token = readToken();
		console.log("do this?");
		console.log(token);
		if (token === null) {
			return R.of(null);
		}

		this.session.token.set(token);
		return this.makeGet("/self/info", userZ.nullable());
	}
}
