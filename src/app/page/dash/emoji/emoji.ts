import { Component, input } from '@angular/core';
import { EmojiZ } from '../api';

@Component({
	selector: 'xg-emoji',
	imports: [],
	templateUrl: './emoji.html',
	styleUrl: './emoji.scss'
})
export class Emoji {
	emojis = input.required<Array<EmojiZ>>();

}
