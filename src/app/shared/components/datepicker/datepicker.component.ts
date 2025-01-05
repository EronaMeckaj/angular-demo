import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IFormField } from '../../models/i-form-field.interface';
import { GenericService } from '../../services/generic.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-datepicker',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TranslatePipe
  ],
  template: `
    @let errorMessage = genericService.getErrorMessage(control, input);
    <mat-form-field [class]="input.inputClass" class="w-100">
      <mat-label>{{ input.label | translate }}</mat-label>
      <input matInput [matDatepicker]="picker" [formControl]="control" />
      @if(input.hint){
      <mat-hint>{{ input.hint | translate }}</mat-hint>
      }
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      @if(errorMessage){
      <mat-error>{{ errorMessage }}</mat-error>
      }
    </mat-form-field>
  `,
})
export class DatePickerComponent {
  readonly genericService = inject(GenericService);
  @Input() input!: IFormField;
  @Input() control: FormControl = new FormControl(null);
}
