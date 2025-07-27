import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as R from "rxjs";
import { z } from "zod";
import { readToken, Session, UserZ, userZ } from './session';

const fixWithPrefix = (url: string): string => {
	if (url.startsWith("/")) {
		return `_${url}`;
	}
	else {
		return `_/${url}`;
	}
};

interface TokenOption {
	headers: {
		xgtoken: string;
	}
}

@Injectable({
	providedIn: 'root'
})
export class Http {
	private readonly http = inject(HttpClient);
	private readonly session = inject(Session);

	private makeFetchOption(): TokenOption | undefined {
		const token = this.session.token();
		if (token === undefined) {
			return ;
		}

		return {
			headers: {
				xgtoken: token
			}
		};
	}

	private makeGetFetch<R>(url: string, codec: z.ZodType<R>): Observable<R> {
		const fixUrl = fixWithPrefix(url);
		const opt = this.makeFetchOption();
		return this.http.get(fixUrl, opt).pipe(R.map(x => codec.parse(x)));
	}

	private makePostFetch<T, R>(url: string, body: T | null, codec: z.ZodType<R>): Observable<R> {
		const fixUrl = fixWithPrefix(url);
		const opt = this.makeFetchOption()
		return this.http.post(fixUrl, body, opt).pipe(R.map(x => codec.parse(x)));
	}

	makeGet<R>(url: string, codec: z.ZodType<R>): Observable<R> {
		return this.makeGetFetch(url, codec);
	}

	makePost<T, R>(url: string, body: T | null, codec: z.ZodType<R>): Observable<R> {
		return this.makePostFetch(url, body, codec);
	}

	initSession(): Observable<UserZ | null> {
		const token = readToken();
		if (token === null) {
			return R.of(null);
		}

		this.session.token.set(token);
		return this.makeGet("/self/info", userZ.nullable());
	}
}
