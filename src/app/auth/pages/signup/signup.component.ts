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
    MatTooltipModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  readonly #authService = inject(AuthService);
  hidePassword: boolean = true;
  confirmPassword: boolean = true;
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
      return 'Fjalëkalimi duhet të ketë të paktën 8 karaktere, të përmbajë një shkronjë të madhe, një numër dhe një karakter të veçantë!';
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
