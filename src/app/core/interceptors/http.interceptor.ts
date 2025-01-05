import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
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
    finalize(() => {
      spinnerService.hide();
    })
  );
};
