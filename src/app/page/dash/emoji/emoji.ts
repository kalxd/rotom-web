import { Component, input } from '@angular/core';
import { EmojiZ } from '../api';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
	selector: 'xg-emoji',
	imports: [
		MatCardModule,
		MatGridListModule
	],
	templateUrl: './emoji.html',
	styleUrl: './emoji.scss'
})
export class Emoji {
	emojis = input.required<Array<EmojiZ>>();
}
