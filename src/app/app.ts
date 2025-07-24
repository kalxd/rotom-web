import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Http } from './data/http';
import { Observable } from 'rxjs';
import { SessionZ } from './data/session';

import { AsyncPipe } from '@angular/common';

import { Load } from "./widget/load/load";

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		AsyncPipe,

		Load
	],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	protected readonly title = signal('rotom-web');
	private readonly http = inject(Http);

	session$: Observable<SessionZ | undefined>;

	constructor() {
		this.session$ = this.http.initSession();
	}
}
