import { Component, inject } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'xg-login',
	imports: [
		ReactiveFormsModule,

		MatToolbarModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule
	],
	templateUrl: './login.html',
	styleUrl: './login.css'
})
export class Login {
	private formBuilder = inject(FormBuilder);

	loginForm = this.formBuilder.group({
		username: ["", Validators.required],
		password: ["", Validators.required]
	});

	beginSubmitLoginForm(): void {
		console.log(this.loginForm.value);
	}
}
