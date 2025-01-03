import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IFormField } from '../../models/i-form-field.interface';

@Component({
  selector: 'app-date-range',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <mat-form-field [class]="input.inputClass" class="w-100">
      <mat-label>{{ input.label }}</mat-label>
      <mat-date-range-input [rangePicker]="rangePicker" [formGroup]="control">
        <input
          matStartDate
          [placeholder]="input.startDatePlaceholder"
          [formControlName]="input.startControlName!"
        />
        <input
          matEndDate
          [placeholder]="input.endDatePlaceholder"
          [formControlName]="input.endControlName!"
        />
      </mat-date-range-input>
      @if (input.hint) {
      <mat-hint>{{ input.hint }}</mat-hint>
      }
      <mat-datepicker-toggle
        matIconSuffix
        [for]="rangePicker"
      ></mat-datepicker-toggle>
      <mat-date-range-picker #rangePicker></mat-date-range-picker>
    </mat-form-field>
  `,
})
export class DateRangeComponent {
  @Input() input!: IFormField;
  @Input() control: FormGroup = new FormGroup({});
}
