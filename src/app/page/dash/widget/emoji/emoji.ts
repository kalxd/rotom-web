import { Component, inject, viewChild } from '@angular/core';
import {
	ActionResult,
	UiContainer,
	UiTaskDirective,
	UiPager,
	UiBox
} from 'drifloon';
import { EmojiState, EmojiZ, SearchEmojiOption } from '../../state/emoji';
import { toObservable } from '@angular/core/rxjs-interop';
import { CatState } from '../../state/cat';
import * as R from "rxjs";
import { EditDialog } from './editdialog';

@Component({
	selector: 'xg-emoji',
	imports: [
		UiContainer,
		UiTaskDirective,
		UiPager,
		UiBox,
		EditDialog
	],
	styleUrl: "./emoji.scss",
	templateUrl: './emoji.html',
})
export class Emoji {
	private catState = inject(CatState);
	private editDialog = viewChild.required(EditDialog);

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

				return this.emojiState.fetchEmojis(body);
			}));
	}

	connectPageChange(page: number): void {
		this.emojiState.page.set(page);
	}

	connectEditEmoji(emoji: EmojiZ): void {
		this.editDialog().show(emoji);
	}

	connectRemoveEmoji(emoji: EmojiZ): void {
		if (!confirm("确认删除这个表情吗？")) {
			return ;
		}

		this.emojiState.removeEmoji(emoji.id)
			.pipe(
				R.exhaustMap(_ => {
					return R.combineLatest([
						this.emojiState.refreshEmojis(),
						this.catState.fetchCats()
					]);
				})
			)
			.subscribe(_ => {});
	}
}
