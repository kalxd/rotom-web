import { inject, Injectable, linkedSignal, signal, WritableSignal } from "@angular/core";
import { z } from "zod";
import * as R from "rxjs";
import { Http } from "../../../data/http";

const catZ = z.object({
	id: z.number().nullable(),
	name: z.string(),
	count: z.number()
});

export type CatZ = z.infer<typeof catZ>;

@Injectable({
	providedIn: "root"
})
export class DashState {
	cats: WritableSignal<Array<CatZ>> = signal([]);
	curCat: WritableSignal<CatZ>;

	private http = inject(Http);

	constructor() {
		this.curCat = linkedSignal({
			source: this.cats,
			computation: (nextCats, curCat) => {
				if (curCat === undefined) {
					return nextCats[0];
				}

				return nextCats.find(cat => cat.id === curCat.value?.id) ?? nextCats[0];
			}
		});
	}

	fetchCats(): R.Observable<Array<CatZ>> {
		return this.http.makeGet("/self/cat/list", catZ.array()).pipe(
			R.tap(cats => {
				this.cats.set(cats);
			})
		);
	}
}
