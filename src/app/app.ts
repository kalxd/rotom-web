import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Http } from './data/http';
import { Session } from './data/session';
import { Load } from "./widget/load/load";
import { Login} from "./page/login/login";
import { Dash } from './page/dash/dash';
import { UiTaskDirective, ActionResult } from 'drifloon';
import * as R from "rxjs";

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		UiTaskDirective,

		Load,
		Login,
		Dash
	],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	private readonly http = inject(Http);
	readonly session = inject(Session);
	protected readonly curSession: R.Observable<ActionResult<unknown>>;

	constructor() {
		this.curSession = this.http.initSession()
			.pipe(
				R.map(ActionResult.Ok),
				R.startWith(ActionResult.Pend)
			);
	}
}
