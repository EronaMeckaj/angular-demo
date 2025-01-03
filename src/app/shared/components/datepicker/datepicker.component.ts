import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IFormField } from '../../models/i-form-field.interface';

@Component({
  selector: 'app-datepicker',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  template: `
    <mat-form-field [class]="input.inputClass" class="w-100">
      <mat-label>{{ input.label }}</mat-label>
      <input matInput [matDatepicker]="picker" [formControl]="control" />
      @if(input.hint){
      <mat-hint>{{ input.hint }}</mat-hint>
      }
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
})
export class DatePickerComponent {
  @Input() input!: IFormField;
  @Input() control: FormControl = new FormControl(null);
}
