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

const emojiZ = z.object({
	id: z.number(),
	catId: z.number().nullable(),
	desc: z.string().nullable(),
	fileSha: z.string()
});

export type EmojiZ = z.infer<typeof emojiZ>;

interface UpdateCat {
	id: number;
	data: {
		name: string;
	}
}

interface AddEmojiOption {
	fileSha: string;
	catId: number | null;
	desc: string | null;
}

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

	updateCat(data: UpdateCat): Observable<CatSelectItem> {
		return this.http
			.makePost("/self/cat/update", data, catZ);
	}

	fetchAllEmojis(catId: number | null): Observable<Array<EmojiZ>> {
		return this.http
			.makePost("/self/emoji/list", { catId }, emojiZ.array());
	}

	addEmoji(emoji: AddEmojiOption): Observable<EmojiZ> {
		return this.http
			.makePost("/self/emoji/create", emoji, emojiZ);
	}

	editEmojiDesc(emojiId: number, desc: string | null): Observable<EmojiZ> {
		const body = {
			id: emojiId,
			data: {
				desc
			}
		};

		return this.http
			.makePost("/self/emoji/update/desc", body, emojiZ);
	}

	removeEmoji(emojiId: number): Observable<void> {
		const body = {
			id: emojiId
		};

		return this.http.makePost("/self/emoji/delete", body, z.any());
	}
}
