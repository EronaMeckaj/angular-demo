import { Injectable } from '@angular/core';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { IOption } from '../models/i-option.interface';
import { AbstractControl, FormControl } from '@angular/forms';
import { IFormField } from '../models/i-form-field.interface';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  getOptionsObservable(
    options: IOption[] | Observable<IOption[]> | undefined
  ): Observable<IOption[]> {
    return options instanceof Observable
      ? options.pipe(map((data) => data || []))
      : new BehaviorSubject<IOption[]>(options || []).asObservable();
  }

  getErrorMessage(control: AbstractControl, input: IFormField): string {
    if (!control || !control.errors) return '';

    const errorMessages = {
      required: `${input.requiredLabel || input.name} is required.`,
      pattern: `Please don't use ${control.errors['pattern']?.actualValue}`,
      minlength: `Please enter more than ${control.errors['minlength']?.requiredLength} characters.`,
      min: `Value must be at least ${control.errors['min']?.min}.`,
      max: `Value must be at most ${control.errors['max']?.max}.`,
    };

    const errorKey = Object.keys(control.errors).find(
      (key): key is keyof typeof errorMessages => key in errorMessages
    );

    return errorKey ? errorMessages[errorKey] : '';
  }
}
