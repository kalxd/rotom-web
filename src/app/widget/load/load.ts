import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
	selector: 'xg-load',
	imports: [
		MatCardModule,
		MatProgressSpinnerModule
	],
	templateUrl: './load.html',
	styleUrl: './load.css'
})
export class Load {
}
