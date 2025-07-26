import { inject, Injectable } from '@angular/core';
import { Http } from '../../data/http';
import { Observable } from 'rxjs';
import { sessionZ, SessionZ } from '../../data/session';

interface LoginOption {
	username: string;
	password: string;
}

@Injectable({
	providedIn: 'root'
})
export class LoginApi {
	private readonly http = inject(Http);

	login(option: LoginOption): Observable<SessionZ> {
		return this.http.makePost(
			"/login",
			option,
			sessionZ
		);
	}
}
