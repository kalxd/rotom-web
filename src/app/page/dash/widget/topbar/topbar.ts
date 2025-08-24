import { Component, inject } from '@angular/core';
import { UiItem, UiTopbar } from 'drifloon';
import { DashState } from '../../state/dash';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'xg-topbar',
	imports: [
		UiTopbar,
		UiItem,
		FormsModule
	],
	templateUrl: './topbar.html',
	styleUrl: './topbar.scss'
})
export class Topbar {
	dashState = inject(DashState);
}
