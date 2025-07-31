import { Component, inject, linkedSignal, signal, WritableSignal } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { Api, CatSelectItem, catSelectItemDef, EmojiZ } from './api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AddCat } from './addcat/addcat';
import * as R from "rxjs";
import { Alert } from '../../widget/alert/alert';
import { Emoji } from "./emoji/emoji";
import { toObservable } from '@angular/core/rxjs-interop';
import { Load } from '../../widget/load/load';
import { ActionResult } from '../../data/result';
import { Upload } from './upload/upload';
import { MatInputModule } from '@angular/material/input';
import { emptyToNull } from '../../data/util';

@Component({
	selector: 'xg-dash',
	imports: [
		FormsModule,

		MatToolbar,
		MatFormFieldModule,
		MatSelectModule,
		MatButton,
		MatInputModule,

		Load,
		Emoji
	],
	templateUrl: './dash.html',
	styleUrl: './dash.scss'
})
export class Dash {
	private readonly api = inject(Api);
	private readonly addCat = inject(AddCat);
	private readonly alert = inject(Alert);
	private readonly uploadDialog = inject(Upload);

	readonly cats: WritableSignal<Array<CatSelectItem>> = signal([]);
	readonly curCat: WritableSignal<CatSelectItem>;

	readonly emojis: WritableSignal<ActionResult<Array<EmojiZ>>> = signal(ActionResult.pend());

	protected readonly searchWord = signal("");

	constructor() {
		this.api.fetchAllCats()
			.subscribe({
				next: xs => this.cats.set(xs),
				error: e => this.alert.show(e)
			});

		this.curCat = linkedSignal({
			source: this.cats,
			computation: (nextCats, curCat) => {
				if (curCat === undefined) {
					return catSelectItemDef;
				}

				return nextCats.find(x => x.id === curCat.value.id) ?? catSelectItemDef;
			}
		});

		const curCat$ = toObservable(this.curCat)
			.pipe(
				R.distinctUntilKeyChanged('id')
			);

		this.refreshEmojiListFrom(curCat$);
	}

	private refreshEmojiListFrom(ob$: R.Observable<unknown>): void {
		ob$
			.pipe(
				R.switchMap(_ => {
					const searchWord = emptyToNull(this.searchWord());
					const catId = this.curCat().id;
					return this.api.fetchAllEmojis(catId, searchWord).pipe(
						R.map(x => ActionResult.ready(x)),
						R.startWith(ActionResult.pend())
					);
				}),
			)
			.subscribe({
				next: xs => this.emojis.set(xs),
				error: e => this.alert.show(e)
			});
	}

	openAddCat(): void {
		this.addCat.show(null)
			.pipe(
				R.switchMap(x => this.api.addCat(x)),
				R.switchMap(_ => this.api.fetchAllCats())
			)
			.subscribe({
				next: xs => {
					this.cats.set(xs);
				},
				error: e => this.alert.show(e)
			});
	}

	openAddCatWith(): void {
		const curCat = this.curCat();
		const curCatId = curCat.id;

		if (curCatId === null) {
			return this.alert.show("很明显，不允许编辑“默认分类”。");
		}
		this.addCat.show({ name: this.curCat().name })
			.pipe(
				R.switchMap(x => {
					return this.api.updateCat({
						id: curCatId,
						data: {
							name: x.name
						}
					}).pipe(R.tap(c => this.curCat.set(c)));
				}),
				R.switchMap(_ => this.api.fetchAllCats())
			)
			.subscribe({
				next: xs => this.cats.set(xs),
				error: e => this.alert.show(e)
			});
	}

	openAddEmojiDialog(): void {
		const e$ = this.uploadDialog.show(this.curCat());
		this.refreshEmojiListFrom(e$);
	}

	protected connectEmojiChange(event: { emoji: EmojiZ, desc: string | null }): void {
		const update$ = this.api.editEmojiDesc(event.emoji.id, event.desc)
		this.refreshEmojiListFrom(update$);
	}

	protected connectEmojiDelete(emoji: EmojiZ): void {
		const api$ = this.api.removeEmoji(emoji.id);
		this.refreshEmojiListFrom(api$);
	}

	protected connectSearch(): void {
		this.refreshEmojiListFrom(R.of(1));
	}
}
