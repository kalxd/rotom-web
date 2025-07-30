import { Component, inject, input, output } from '@angular/core';
import { EmojiZ } from '../api';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DescDialog } from './descdialog/descdialog';

interface EmojiChangeEvent {
	emoji: EmojiZ;
	desc: string | null;
}

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
	emojiChange = output<EmojiChangeEvent>();
	emojiDelete = output<EmojiZ>();

	private readonly descDialog = inject(DescDialog);

	showDescEditor(emoji: EmojiZ): void {
		this.descDialog.show(emoji.desc)
			.subscribe(desc => this.emojiChange.emit({ emoji, desc }));
	}

	confirmDelete(emoji: EmojiZ): void {
		if (!confirm("确认删除当前表情？")) {
			return ;
		}

		this.emojiDelete.emit(emoji);
	}
}
