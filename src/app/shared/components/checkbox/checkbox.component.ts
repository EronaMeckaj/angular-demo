import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IFormField } from '../../models/i-form-field.interface';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-checkbox',
  imports: [MatCheckboxModule, MatFormFieldModule, ReactiveFormsModule],
  template: `
    <mat-checkbox [class]="input.inputClass" [formControl]="control">
      {{ input.label }}</mat-checkbox
    >
    @if (input.hint) {
    <mat-hint>{{ input.hint }}</mat-hint>
    }
  `,
})
export class CheckboxComponent {
  @Input() input!: IFormField;
  @Input() control: FormControl = new FormControl('');
}
