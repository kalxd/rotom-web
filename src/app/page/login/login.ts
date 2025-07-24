import { Component, inject } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginApi } from './api';
import { Session } from '../../data/session';

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
	private readonly loginApi = inject(LoginApi);
	private session = inject(Session);

	loginForm = this.formBuilder.group({
		username: ["", Validators.required],
		password: ["", Validators.required]
	});

	beginSubmitLoginForm(): void {
		this.loginForm.markAllAsDirty();
		this.loginForm.updateValueAndValidity();

		if (this.loginForm.invalid) {
			return;
		}

		this.loginApi
			.login({ username: this.loginForm.value.username!, password: this.loginForm.value.password! })
			.subscribe({
				next: session => {
					this.session.session = session;
				},
				// error: console.log
			});
	}
}
