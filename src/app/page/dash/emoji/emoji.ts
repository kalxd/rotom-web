import { Component, inject, input, output } from '@angular/core';
import { CatSelectItem, EmojiZ } from '../api';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DescDialog } from './descdialog/descdialog';

export interface EmojiChangeEvent {
	emoji: EmojiZ;
	cat: CatSelectItem;
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
	curCat = input.required<CatSelectItem>();
	cats = input.required<Array<CatSelectItem>>();

	emojiChange = output<EmojiChangeEvent>();
	emojiDelete = output<EmojiZ>();

	private readonly descDialog = inject(DescDialog);

	showDescEditor(emoji: EmojiZ): void {
		this.descDialog
			.show({
				cats: this.cats(),
				curCat: this.curCat(),
				desc: emoji.desc
			})
			.subscribe(output => this.emojiChange.emit({ ...output, emoji }));
	}

	confirmDelete(emoji: EmojiZ): void {
		if (!confirm("确认删除当前表情？")) {
			return ;
		}

		this.emojiDelete.emit(emoji);
	}
}
