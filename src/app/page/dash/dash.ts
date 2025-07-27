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

@Component({
	selector: 'xg-dash',
	imports: [
		FormsModule,

		MatToolbar,
		MatFormFieldModule,
		MatSelectModule,
		MatButton,

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

	readonly cats: WritableSignal<Array<CatSelectItem>> = signal([]);
	readonly curCat: WritableSignal<CatSelectItem>;

	readonly emojis: WritableSignal<ActionResult<Array<EmojiZ>>> = signal(ActionResult.pend());

	constructor() {
		this.api.fetchAllCats()
			.subscribe(xs => this.cats.set(xs));

		this.curCat = linkedSignal({
			source: this.cats,
			computation: (nextCats, curCat) => {
				if (curCat === undefined) {
					return catSelectItemDef;
				}

				return nextCats.find(x => x.id === curCat.value.id) ?? catSelectItemDef;
			}
		});

		toObservable(this.curCat)
			.pipe(
				R.switchMap(cat => {
					return this.api.fetchAllEmojis(cat.id)
						.pipe(
							R.map(xs => ActionResult.ready(xs)),
							R.delay(5 * 1000),
							R.startWith(ActionResult.pend())
						);
				})
			)
			.subscribe(xs => this.emojis.set(xs));
	}

	openAddCat(): void {
		this.addCat.show(null)
			.pipe(
				R.switchMap(x => this.api.addCat(x)),
				R.switchMap(_ => this.api.fetchAllCats())
			)
			.subscribe(xs => {
				this.cats.set(xs);
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
					});
				}),
				R.switchMap(_ => this.api.fetchAllCats())
			)
			.subscribe(xs => this.cats.set(xs));
	}
}
