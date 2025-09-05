import { computed, inject, Injectable, signal } from "@angular/core";
import { z } from "zod";
import * as R from "rxjs";
import { Http } from "../../../data/http";
import { toObservable } from "@angular/core/rxjs-interop";
import { emptyStrToNull, emptyStrToUndefined, PagerInput } from "drifloon";
import { CatState } from "./cat";

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
	searchWord?: string;
	page: number;
}

export interface AddEmojiOption {
	fileSha: string;
	catId: number | null;
	desc?: string;
}

export interface UpdateEmojiOption {
	catId: number | null;
	desc?: string;
}

@Injectable({
	providedIn: "root"
})
export class EmojiState {
	private http = inject(Http);
	private catState = inject(CatState);

	emojiPager = signal<PagerResult<EmojiZ>>({
		count: 0,
		hits: []
	});

	searchWord = signal("");

	searchTrimWord = computed<undefined | string>(() => {
		return emptyStrToUndefined(this.searchWord());
	});
	searchClick = new R.Subject<void>();

	page = signal(1);
	size = signal(12);

	searchWord$: R.Observable<string | undefined> = this.searchClick.asObservable().pipe(
		R.debounceTime(200),
		R.map(_ => this.searchTrimWord())
	);

	pager = computed<PagerInput>(() => ({
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

	refreshEmojis(): R.Observable<PagerResult<EmojiZ>> {
		const option: SearchEmojiOption = {
			catId: this.catState.curCat().id,
			page: this.page(),
			searchWord: this.searchTrimWord()
		};

		return this.fetchEmojis(option);
	}

	addEmoji(body: AddEmojiOption): R.Observable<EmojiZ> {
		return this.http.makePost("/self/emoji/create", body, emojiZ);
	}

	updateEmoji(emoji: EmojiZ, option: UpdateEmojiOption): R.Observable<EmojiZ> {
		const body = {
			id: emoji.id,
			data: {
				desc: option.desc,
				catId: option.catId
			}
		};

		return this.http.makePost("/self/emoji/update", body, emojiZ);
	}

	removeEmoji(emojiId: number): R.Observable<void> {
		const body = {
			id: emojiId
		};

		return this.http.makePost("/self/emoji/delete", body, z.any());
	}
}
