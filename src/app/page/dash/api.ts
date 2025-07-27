import { inject, Injectable } from '@angular/core';
import { Http } from '../../data/http';
import { Observable } from 'rxjs';
import { z } from "zod";
import * as R from "rxjs";

const catZ = z.object({
	id: z.number(),
	name: z.string()
});

export interface CatSelectItem {
	id: number | null;
	name: string;
}

export const catSelectItemDef: CatSelectItem = {
	id: null,
	name: "默认分类"
};

@Injectable({
	providedIn: 'root'
})
export class Api {
	private readonly http = inject(Http);

	fetchAllCats(): Observable<Array<CatSelectItem>> {
		return this.http
			.makeGet("/self/cat/list", catZ.array())
			.pipe(
				R.map(xs => {
					return [
						catSelectItemDef,
						...xs
					];
				})
			);
	}

	addCat(data: { name: string }): Observable<CatSelectItem> {
		return this.http
			.makePost("/self/cat/create", data, catZ);
	}
}
