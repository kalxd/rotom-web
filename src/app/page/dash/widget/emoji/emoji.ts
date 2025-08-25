import { Component, inject } from '@angular/core';
import { ActionResult, UiContainer, UiTaskDirective, UiPager } from 'drifloon';
import { EmojiState, SearchEmojiOption } from '../../state/emoji';
import { toObservable } from '@angular/core/rxjs-interop';
import { CatState } from '../../state/cat';
import * as R from "rxjs";

@Component({
	selector: 'xg-emoji',
	imports: [
		UiContainer,
		UiTaskDirective,
		UiPager
	],
	templateUrl: './emoji.html',
})
export class Emoji {
	private catState = inject(CatState);
	emojiState = inject(EmojiState);

	isLoad$: R.Observable<ActionResult<unknown>>;

	constructor() {
		const page$ = toObservable(this.emojiState.page)
			.pipe(R.distinctUntilChanged());

		const cat$ = toObservable(this.catState.curCat)
			.pipe(R.distinctUntilKeyChanged("id"));

		this.isLoad$ = R.combineLatest([ page$, cat$, this.emojiState.searchWord$ ])
			.pipe(ActionResult.concatMap(([page, cat, searchWord]) => {
				const body: SearchEmojiOption = {
					page,
					catId: cat.id,
					searchWord
				};

				console.log(this.emojiState.pager());
				return this.emojiState.fetchEmojis(body);
			}));
	}

	connectPageChange(page: number): void {
		this.emojiState.page.set(page);
	}
}
