import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { PasswordValidator } from '../validators/password.validator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatTooltipModule,
    TranslatePipe
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  readonly #authService = inject(AuthService);
  readonly #translateService = inject(TranslateService);

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  readonly signUpForm = new FormGroup(
    {
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        PasswordValidator.passwordComplexity(),
      ]),
      confirmPassword: new FormControl(null, [Validators.required
      ]),
    },
    { validators: PasswordValidator.confirmMatchValidator('password', 'confirmPassword') }
  );

  getPasswordTooltip(): string {
    const passwordControl = this.signUpForm.get('password');
    if (passwordControl?.touched && passwordControl?.hasError('passwordComplexity')) {
      return this.#translateService.instant('AUTHENTICATION.password_complexity');
    }
    return '';
  }

  signUp() {
    if (!this.signUpForm.valid) {
      return;
    }
    const { username, password } = this.signUpForm.getRawValue();
    this.#authService
      .signup({ username: username!, password: password! })
      .subscribe();
  }

}
