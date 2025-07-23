import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { Http } from './data/http';
import { Observable } from 'rxjs';
import { SessionZ } from './data/session';
import { Root } from "./page/root/root";

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		MatButton,

		Root
	],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	protected readonly title = signal('rotom-web');
	private readonly http = inject(Http);

	user$: Observable<SessionZ | undefined> = this.http.initSession();

	buttonClickE(): void {
		alert("do this?");
		console.log("do this?");
	}
}
