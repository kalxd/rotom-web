import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Http } from './data/http';
import { Session } from './data/session';
import { Load } from "./widget/load/load";
import { Login} from "./page/login/login";
import { Dash } from './page/dash/dash';
import { ActionResult } from './data/result';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,

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
	protected readonly curSession: WritableSignal<ActionResult<unknown>>
		= signal(ActionResult.pend());

	constructor() {
		this.http.initSession()
			.subscribe(session => {
				if (session !== null) {
					this.session.token.set(session.token);
				}

				this.curSession.set(ActionResult.ready(session));
			});
	}
}
