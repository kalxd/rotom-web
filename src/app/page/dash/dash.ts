import { Component, inject, linkedSignal, signal, WritableSignal } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { Api, CatSelectItem, catSelectItemDef } from './api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'xg-dash',
	imports: [
		FormsModule,

		MatToolbar,
		MatFormFieldModule,
		MatSelectModule,
		MatButton
	],
	templateUrl: './dash.html',
	styleUrl: './dash.scss'
})
export class Dash {
	private readonly api = inject(Api);

	readonly cats: WritableSignal<Array<CatSelectItem>> = signal([]);
	readonly curCat: WritableSignal<CatSelectItem>;

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
	}
}
