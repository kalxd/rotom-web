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
	styleUrl: "./emoji.css",
	templateUrl: './emoji.html',
})
export class Emoji {
	private catState = inject(CatState);
	private editDialog = viewChild.required(EditDialog);

	emojiState = inject(EmojiState);

	isLoad$: R.Observable<ActionResult<unknown>>;

	constructor() {
		const page$: R.Observable<SearchEmojiOption> = toObservable(this.emojiState.page).pipe(
			R.map(page => ({
				page,
				catId: this.catState.curCat().id,
				searchWord: this.emojiState.searchTrimWord()
			}))
		);

		const cat$: R.Observable<SearchEmojiOption> = toObservable(this.catState.curCat).pipe(
			R.distinctUntilKeyChanged("id"),
			R.tap(_ => {
				this.emojiState.searchWord.set("");
			}),
			R.map(cat => ({
				page: this.emojiState.page(),
				catId: cat.id
			}))
		);

		const search$: R.Observable<SearchEmojiOption> = this.emojiState.searchWord$.pipe(
			R.map(search => ({
				page: this.emojiState.page(),
				catId: this.catState.curCat().id,
				searchWord: search
			}))
		);

		this.isLoad$ = R.merge(page$, cat$, search$).pipe(
			R.auditTime(50),
			ActionResult.concatMap(option => this.emojiState.fetchEmojis(option)),
		);
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
