import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as R from "rxjs";
import { z } from "zod";

@Injectable({
	providedIn: 'root'
})
export class Http {
	private readonly http = inject(HttpClient);

	makeGet<R>(url: string, codec: z.ZodType<R>): Observable<R> {
		return this.http.get(url).pipe(R.map(x => codec.parse(x)))
	}

	makePost<T, R>(url: string, body: T | null, codec: z.ZodType<R>): Observable<R> {
		return this.http.post(url, body).pipe(R.map(x => codec.parse(x)));
	}
}
