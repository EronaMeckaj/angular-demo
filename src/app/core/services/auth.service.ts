import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AUTH_URLS } from '../../shared/constants/api-urls';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAuthRequest } from '../models/i-auth-request.interface';
import { jwtDecode } from 'jwt-decode';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    readonly #httpService = inject(HttpService);
    readonly #router = inject(Router);
    readonly #snackBar = inject(MatSnackBar);
    private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
    token$ = this.tokenSubject.asObservable();

    login(credentials: IAuthRequest): Observable<any> {
        return this.#httpService.post<any>(AUTH_URLS.login, credentials).pipe(
            tap((data) => {
                if (data?.token) {
                    this.setToken(data.token);
                    this.#router.navigate(['home']);
                }
            })
        );
    }


    signup(credentials: IAuthRequest): Observable<any> {
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

    setToken(token: string): void {
        localStorage.setItem('access_token', token);
        this.tokenSubject.next(token);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    isTokenExpired(): boolean {
        const token = this.tokenSubject.getValue();
        if (!token) return true;

        const decodedToken: any = jwtDecode(token);
        const currentDate = new Date();
        const expiresIn = new Date(decodedToken.exp * 1000);

        return currentDate > expiresIn;
    }

    isLoggedIn(): boolean {
        const token = this.tokenSubject.getValue()
        return token != null && !this.isTokenExpired();
    }


    logout(): void {
        localStorage.removeItem('access_token');
        this.tokenSubject.next(null);
        this.#router.navigate(['login']);
    }
}
