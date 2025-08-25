import { Component } from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { UiBaseDialog, UiDialog, UiDialogBox, UiForm, UiFormField, UiTopbar } from "drifloon";

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
export class CatDialog extends UiBaseDialog<string | undefined, void> {
	fg = this.fb.group({
		name: ["", Validators.required]
	})

	override updateInput(value: string | undefined): void {
		console.log(value);
		this.fg.setValue({
			name: value ?? ""
		});
	}

	get formTitle(): string {
		if (this.fg.value.name) {
			return `编辑当前分类：${this.fg.value.name}`;
		}
		else {
			return "新建分类";
		}
	}
}
