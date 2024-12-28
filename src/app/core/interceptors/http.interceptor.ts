import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const spinnerService = inject(NgxSpinnerService);

    spinnerService.show();

    const clonedRequest = authService.isLoggedIn()
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${authService.getToken()}`,
            },
        })
        : req;

    return next(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred.';
            if (error.error instanceof ErrorEvent) {
                errorMessage = `Client Error: ${error.error.message}`;
            } else {
                errorMessage = `Server Error: ${error.status} - ${error.message}`;
            }
            console.error('HTTP Error:', errorMessage, error);
            return throwError(() => new Error(errorMessage));
        }),
        finalize(() => {
            spinnerService.hide();
        })
    );
};
