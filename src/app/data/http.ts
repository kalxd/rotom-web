import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

const httpErrorZ = z.object({
	msg: z.string()
});

const extractErrorMsg = (e: unknown): string => {
	if (e instanceof HttpErrorResponse) {
		if (e.status === 413) {
			return "图片过大！";
		}

		if (e.status === 400) {
			return "请求数据格式不正确，请查看！";
		}

		const result = httpErrorZ.safeParse(e.error);
		if (result.success) {
			return result.data.msg;
		}
		else {
			return result.error.message;
		}
	}
	else if (e instanceof Error) {
		return e.message;
	}
	else if (typeof e === "string") {
		return e;
	}
	else {
		return `${e}`;
	}
};

interface TokenOption {
	headers: {
		xgtoken: string;
	}
}

interface SessionUser {
	token: string;
	user: UserZ;
}

const fileZ = z.object({
	sha: z.string(),
	extension: z.string()
});

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
		return this.http.get(fixUrl, opt).pipe(
			R.map(x => codec.parse(x)),
			R.catchError(e => {
				const msg = extractErrorMsg(e);
				alert(msg);
				return R.EMPTY;
			})
		);
	}

	private makePostFetch<T, R>(url: string, body: T | null, codec: z.ZodType<R>): Observable<R> {
		const fixUrl = fixWithPrefix(url);
		const opt = this.makeFetchOption()

		return this.http.post(fixUrl, body, opt).pipe(
			R.map(x => codec.parse(x)),
			R.catchError(e => {
				const msg = extractErrorMsg(e);
				alert(msg);
				return R.EMPTY;
			})
		);
	}

	makeGet<R>(url: string, codec: z.ZodType<R>): Observable<R> {
		return this.makeGetFetch(url, codec);
	}

	makePost<T, R>(url: string, body: T | null, codec: z.ZodType<R>): Observable<R> {
		return this.makePostFetch(url, body, codec);
	}

	initSession(): Observable<SessionUser | null> {
		const token = readToken();
		if (token === null) {
			return R.of(null);
		}

		const opt = {
			headers: {
				xgtoken: token
			}
		};

		return this.http.get(fixWithPrefix("/self/info"), opt)
			.pipe(
				R.map(x => userZ.nullable().parse(x)),
				R.map(user => {
					if (user === null) {
						return null;
					}
					return { token, user };
				})
			);
	}

	uploadFile(file: File): Observable<z.infer<typeof fileZ>> {
		const fd = new FormData();
		fd.append("file", file);

		const url = fixWithPrefix("/file/upload");
		const opt = this.makeFetchOption();
		return this.http
			.post(url, fd, opt)
			.pipe(
				R.map(x => fileZ.parse(x)),
				R.catchError(e => {
					const msg = extractErrorMsg(e);
					alert(msg);
					return R.EMPTY;
				})
			);
	}
}
