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
  templateUrl: './date-range.component.html',
  styleUrl: './date-range.component.scss',
})
export class DateRangeComponent {
  @Input() dateRangeConfig!: IFormField;
  @Input() control: FormGroup = new FormGroup({});
}
