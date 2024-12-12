import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { Observable, tap } from 'rxjs';
import { AUTH_URLS } from '../../shared/constants/api-urls';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    readonly #httpService = inject(HttpService);
    readonly #router = inject(Router);
    readonly #snackBar = inject(MatSnackBar);

    login(credentials: { username: string; password: string }): Observable<any> {
        return this.#httpService.post<any>(AUTH_URLS.login, credentials).pipe(
            tap((data) => {
                if (data?.token) {
                    this.setToken(data.token);
                    this.#router.navigate(['home']);
                }
            })
        );
    }


    signup(credentials: { username: string; password: string }): Observable<any> {
        return this.#httpService.post<any>(AUTH_URLS.signup, credentials).pipe(
            tap(() => {
                this.#snackBar.open('Signup successful! Please log in.', 'Close', {
                    duration: 3000,
                    panelClass: ['success-snackbar'],
                });
                this.#router.navigate(['auth/login'])
            })
        );
    }

    setToken(accessToken: string): void {
        localStorage.setItem('access_token', accessToken);
    }

    logout() {
        localStorage.removeItem('access_token');
    }
}
