import { Component, input } from '@angular/core';
import { EmojiZ } from '../api';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'xg-emoji',
	imports: [
		MatCardModule,
		MatButtonModule
	],
	templateUrl: './emoji.html',
	styleUrl: './emoji.scss'
})
export class Emoji {
	emojis = input.required<Array<EmojiZ>>();
}
