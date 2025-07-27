import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Http } from './data/http';
import { Session } from './data/session';
import { AsyncPipe } from '@angular/common';
import { Load } from "./widget/load/load";
import { Login} from "./page/login/login";
import { Dash } from './page/dash/dash';
import { Observable } from 'rxjs';
import * as R from "rxjs";

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		AsyncPipe,

		Load,
		Login,
		Dash
	],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	protected readonly title = signal('rotom-web');
	private readonly http = inject(Http);
	readonly session = inject(Session);

	readonly session$: Observable<boolean>;

	constructor() {
		this.session$ = this.http.initSession()
			.pipe(
				R.map(_ => true)
			);
	}
}
