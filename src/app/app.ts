import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButton } from "@angular/material/button";

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		MatButton
	],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	protected readonly title = signal('rotom-web');

	buttonClickE(): void {
		alert("do this?");
		console.log("do this?");
	}
}
