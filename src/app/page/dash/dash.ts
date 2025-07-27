import { Component, inject } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { Api, CatZ } from './api';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Load } from '../../widget/load/load';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
	selector: 'xg-dash',
	imports: [
		AsyncPipe,

		Load,
		MatToolbar,
		MatFormFieldModule,
		MatSelectModule
	],
	templateUrl: './dash.html',
	styleUrl: './dash.scss'
})
export class Dash {
	private readonly api = inject(Api);

	readonly catsSelect$: Observable<Array<CatZ | null>>;

	constructor() {
		this.catsSelect$ = this.api.fetchAllCats();
	}
}
