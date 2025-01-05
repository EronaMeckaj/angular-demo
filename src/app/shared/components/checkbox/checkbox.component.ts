import { Component, Input, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IFormField } from '../../models/i-form-field.interface';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GenericService } from '../../services/generic.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-checkbox',
  imports: [
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  template: `
    @let errorMessage = genericService.getErrorMessage(control, input);
    <mat-checkbox [class]="input.inputClass" [formControl]="control">
      {{ input.label | translate }}</mat-checkbox
    >
    @if (input.hint) {
    <mat-hint>{{ input.hint | translate }}</mat-hint>
    } 
    @if(errorMessage){
    <mat-error>{{ errorMessage }}</mat-error>
    }
  `,
})
export class CheckboxComponent {
  readonly genericService = inject(GenericService);

  @Input() input!: IFormField;
  @Input() control: FormControl = new FormControl('');
}
