import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { Http } from './data/http';
import { Observable } from 'rxjs';
import { SessionZ } from './data/session';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		MatButton,
		MatProgressSpinnerModule,

		AsyncPipe
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

	buttonClickE(): void {
		alert("do this?");
		console.log("do this?");
	}
}
