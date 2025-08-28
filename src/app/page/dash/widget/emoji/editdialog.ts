import { Component, inject, signal } from "@angular/core";
import {
	emptyStrToUndefined,
	UiBaseFormDialog,
	UiFormDialog,
	UiFormField
} from "drifloon";
import { EmojiState, EmojiZ } from "../../state/emoji";
import { ReactiveFormsModule } from "@angular/forms";
import { CatState } from "../../state/cat";
import * as R from "rxjs";

@Component({
	selector: "xg-edit-dialog",
	templateUrl: "./editdialog.html",
	imports: [
		UiFormDialog,
		UiFormField,
		ReactiveFormsModule
	]
})
export class EditDialog extends UiBaseFormDialog<EmojiZ, void> {
	catState = inject(CatState);
	emojiState = inject(EmojiState);

	isLoad = signal(false);
	emoji = signal<EmojiZ | null>(null);

	fg = this.fb.nonNullable.group({
		cat: [this.catState.curCat()],
		desc: [""],
	});

	override init(emoji: EmojiZ): void {
		this.fg.controls.cat.setValue(this.catState.curCat());
		this.fg.controls.desc.setValue(emoji.desc ?? "");
		this.emoji.set(emoji);
	}

	override submit(): R.Observable<void> {
		const emoji = this.emoji();
		if (emoji === null) {
			return R.EMPTY;
		}

		const desc = emptyStrToUndefined(this.fg.controls.desc.value);
		const cat = this.fg.controls.cat.value;

		return this.emojiState.updateEmoji(emoji, { desc, catId: cat.id })
			.pipe(
				R.concatMap(_ => {
					return R.combineLatest([
						this.emojiState.refreshEmojis(),
						this.catState.fetchCats()
					]);
				}),
				R.map(_ => {})
			);
	}
}
