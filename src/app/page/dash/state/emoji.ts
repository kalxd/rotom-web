import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { z } from "zod";
import { CatState } from "./cat";
import * as R from "rxjs";
import { Http } from "../../../data/http";

const emojiZ = z.object({
	id: z.number(),
	catId: z.number().nullable(),
	desc: z.string().nullable(),
	fileSha: z.string()
});

interface PagerResult<T> {
	count: number;
	hits: Array<T>;
}

const pagerResult = <T>(data: z.ZodType<T>) => {
	return z.object({
		count: z.number(),
		hits: data.array()
	});
};

export type EmojiZ = z.infer<typeof emojiZ>;

@Injectable({
	providedIn: "root"
})
export class EmojiState {
	private catState = inject(CatState);
	private http = inject(Http);

	emojis = signal<Array<EmojiZ>>([]);

	searchWord = signal("");
	page = signal(1);

	pager: Signal<{ page: number; size: number }> = computed(() => ({
		page: this.page(),
		size: 10
	}));

	fetchCurEmojis(): R.Observable<PagerResult<EmojiZ>> {
		const body = {
			pager: this.pager(),
			catId: this.catState.curCat().id,
			searchWord: this.searchWord() ?? null
		};

		return this.http.makePost("/self/emoji/list", body, pagerResult(emojiZ));
	}
}
