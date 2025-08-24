import { Component, inject } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginApi } from './api';
import { Session } from '../../data/session';
import { UiContainer, UiForm, UiFormField } from 'drifloon';

@Component({
	selector: 'xg-login',
	imports: [
		ReactiveFormsModule,
		UiContainer,
		UiForm,
		UiFormField,

		MatToolbarModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule
	],
	templateUrl: './login.html',
	styleUrl: './login.scss'
})
export class Login {
	private formBuilder = inject(FormBuilder);
	private readonly loginApi = inject(LoginApi);
	private session = inject(Session);

	protected loginForm = this.formBuilder.group({
		username: ["", Validators.required],
		password: ["", Validators.required]
	});

	protected connectLogin(): void {
		this.loginForm.markAllAsDirty();

		if (this.loginForm.invalid) {
			return;
		}

		this.loginApi
			.login({
				username: this.loginForm.value.username!,
				password: this.loginForm.value.password!
			})
			.subscribe({
				next: session => {
					this.session.writeSession(session);
				},
			});
	}
}
