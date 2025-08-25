import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { z } from "zod";
import * as R from "rxjs";
import { Http } from "../../../data/http";
import { toObservable } from "@angular/core/rxjs-interop";

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

const pagerResult = <T>(data: z.ZodType<T>): z.ZodType<PagerResult<T>> => {
	return z.object({
		count: z.number(),
		hits: data.array()
	});
};

export type EmojiZ = z.infer<typeof emojiZ>;

export interface SearchEmojiOption {
	catId: number | null;
	searchWord: string | null;
	page: number;
}

@Injectable({
	providedIn: "root"
})
export class EmojiState {
	private http = inject(Http);

	emojiPager = signal<PagerResult<EmojiZ>>({
		count: 0,
		hits: []
	});

	searchWord = signal("");
	searchClick = new R.Subject<void>();

	searchWord$: R.Observable<string | null> = toObservable(this.searchWord).pipe(
		R.sample(this.searchClick.asObservable()),
		R.debounceTime(200),
		R.map(word => {
			const s = word.trim();
			if (s.length === 0) {
				return null;
			}
			return s;
		}),
		R.startWith<string | null>(null)
	);

	page = signal(1);
	size = signal(1);

	pager: Signal<{ page: number; size: number, count: number }> = computed(() => ({
		page: this.page(),
		size: this.size(),
		count: this.emojiPager().count
	}));

	fetchEmojis(option: SearchEmojiOption): R.Observable<PagerResult<EmojiZ>> {
		const body = {
			catId: option.catId,
			searchWord: option.searchWord,
			pager: {
				page: option.page,
				size: this.size()
			}
		};

		return this.http
			.makePost("/self/emoji/list", body, pagerResult(emojiZ))
			.pipe(
				R.tap(pager => this.emojiPager.set(pager))
			);
	}
}
