import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  readonly #router = inject(Router);
  readonly #snackBar = inject(MatSnackBar);

  /**
   * Handles all types of errors globally.
   * @param error - The error object to handle.
   */
  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else if (error instanceof Error) {
      this.handleClientError(error);
    } else {
      this.handleUnknownError(error);
    }
  }

  /**
   * Handles HTTP errors.
   * @param error - The HttpErrorResponse object.
   */
  private handleHttpError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        this.#snackBar.open(error.error.message, 'Close', {
          duration: 5000,
        });
        this.#router.navigate(['/login']);
        break;

      case 403:
        this.#snackBar.open(
          'Access denied. You do not have permission.',
          'Close',
          { duration: 5000 }
        );
        break;

      case 404:
        this.#snackBar.open('The requested resource was not found.', 'Close', {
          duration: 5000,
        });
        break;

      case 500:
        this.#snackBar.open('Server error. Please try again later.', 'Close', {
          duration: 5000,
        });
        break;

      case 0:
        this.#snackBar.open(
          'Network error. Please check your connection.',
          'Close',
          { duration: 5000 }
        );
        break;

      default:
        this.#snackBar.open('An unexpected error occurred.', 'Close', {
          duration: 5000,
        });
    }
  }

  /**
   * Handles client-side errors.
   * @param error - The Error object.
   */
  private handleClientError(error: Error): void {
    console.error('Client-side Error:', error.message);
    this.#snackBar.open(
      'An application error occurred. Please contact support.',
      'Close',
      { duration: 5000 }
    );
  }

  /**
   * Handles unknown or untyped errors.
   * @param error - The unknown error.
   */
  private handleUnknownError(error: any): void {
    console.error('Unknown Error:', error);
    this.#snackBar.open(
      'An unknown error occurred. Please try again later.',
      'Close',
      { duration: 5000 }
    );
  }
}
