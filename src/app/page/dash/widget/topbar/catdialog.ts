import { Component, inject, signal } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { UiBaseDialog, UiDialog, UiDialogBox, UiForm, UiFormField } from "drifloon";
import { CatZ, CatState, UpdateCatOption } from "../../state/cat";
import * as R from "rxjs";

export interface CatZWithId {
	id: number;
	name: string;
}

@Component({
	selector: "xg-cat-dialog",
	templateUrl: "./catdialog.html",
	imports: [
		UiDialog,
		UiForm,
		UiFormField,
		UiDialogBox,
		ReactiveFormsModule
	]
})
export class CatDialog extends UiBaseDialog<CatZWithId | null, void> {
	private cat = signal<CatZWithId | null>(null);
	private catState = inject(CatState);

	fg = this.fb.nonNullable.group({
		name: ["", Validators.required]
	});

	override updateInput(value: CatZWithId | null): void {
		this.cat.set(value);
		if (value === null) {
			this.fg.reset();
		}
		else {
			this.fg.setValue({
				name: value.name
			});
		}
	}

	get formTitle(): string {
		const curCat = this.cat();
		if (curCat === null) {
			return "新建分类";
		}
		else {
			return `编辑当前分类：${curCat.name}`;
		}
	}

	private updateCat(curCat: CatZWithId, value: Required<typeof this.fg.value>): R.Observable<CatZ> {
		const body: UpdateCatOption = {
			id: curCat.id,
			data: {
				name: value.name
			}
		};

		return this.catState.updateCat(body);
	}

	private submitCat(value: Required<typeof this.fg.value>): R.Observable<CatZ> {
		const curCat = this.cat();
		if (curCat === null) {
			return this.catState.addCat(value.name);
		}

		return this.updateCat(curCat, value);
	}

	connectSubmit(): void {
		this.fg.markAllAsDirty();
		if (this.fg.invalid) {
			return ;
		}

		this.submitCat(this.fg.value as Required<typeof this.fg.value>)
			.pipe(
				R.concatMap(_ => this.catState.fetchCats())
			)
			.subscribe(_ => this.setFinalResult(undefined));
	}
}
