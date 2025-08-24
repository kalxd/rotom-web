import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Http } from './data/http';
import { Session } from './data/session';
import { Login} from "./page/login/login";
import { Dash } from './page/dash/dash';
import { UiTaskDirective, ActionResult } from 'drifloon';
import * as R from "rxjs";
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		UiTaskDirective,

		Login,
		Dash
	],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	private readonly http = inject(Http);
	readonly session = inject(Session);
	protected readonly curSession: R.Observable<ActionResult<string | undefined>>;

	constructor() {
		const session$ = toObservable(this.session.token);

		this.curSession = this.http.initSession()
			.pipe(
				ActionResult.concatMap(session => {
					return session$.pipe(
						R.skip(1),
						R.startWith(session?.token)
					);
				})
			);
	}
}
