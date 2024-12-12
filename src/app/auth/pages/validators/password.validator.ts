import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
    static passwordComplexity(config: {
        minLength?: number;
        upperCase?: boolean;
        lowerCase?: boolean;
        numeric?: boolean;
        specialChar?: boolean;
    } = { minLength: 8, upperCase: true, lowerCase: true, numeric: true, specialChar: true }): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) return null;

            const validations = [
                { key: 'minLength', valid: value.length >= (config.minLength || 8) },
                { key: 'upperCase', valid: !config.upperCase || /[A-Z]/.test(value) },
                { key: 'lowerCase', valid: !config.lowerCase || /[a-z]/.test(value) },
                { key: 'numeric', valid: !config.numeric || /[0-9]/.test(value) },
                { key: 'specialChar', valid: !config.specialChar || /[!@#$%^&*(),.?":{}|<>]/.test(value) },
            ];

            const invalid = validations.filter((v) => !v.valid);

            return invalid.length
                ? {
                    passwordComplexity: invalid.map((v) => v.key),
                }
                : null;
        };
    }

    static confirmMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const control = formGroup.get(controlName);
            const matchingControl = formGroup.get(matchingControlName);

            if (!control || !matchingControl) return null;

            const errors = matchingControl.errors || {};
            const isMismatch = control.value !== matchingControl.value;

            matchingControl.setErrors(isMismatch ? { ...errors, passwordsMismatch: true } : null);
            return null;
        };
    }

}
