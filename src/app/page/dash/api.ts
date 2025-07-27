import { inject, Injectable } from '@angular/core';
import { Http } from '../../data/http';
import { Observable } from 'rxjs';
import { z } from "zod";
import * as R from "rxjs";

const catZ = z.object({
	id: z.number(),
	name: z.string()
});

export type CatZ = z.infer<typeof catZ>;

@Injectable({
	providedIn: 'root'
})
export class Api {
	private readonly http = inject(Http);

	fetchAllCats(): Observable<Array<CatZ | null>> {
		return this.http
			.makeGet("/self/cat/list", catZ.array())
			.pipe(
				R.map(xs => [null, ...xs])
			);
	}
}
