import { Component, Input, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IFormField } from '../../models/i-form-field.interface';
import { GenericService } from '../../services/generic.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-text-area',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  template: `
    @let errorMessage = genericService.getErrorMessage(control, input);
    <mat-form-field [class]="input.inputClass" class="w-100">
      <mat-label>{{ input.label | translate }}</mat-label>
      <textarea
        matInput
        [placeholder]="input.placeholder ?? '' | translate"
        [formControl]="control"
        [name]="input.name"
        type="text"
        [readonly]="input.readonly"
      ></textarea>
      @if (input.hint) {
      <mat-hint>{{ input.hint }}</mat-hint>
      } @if(input.enableSuffixIcon && !control.value){
      <mat-icon matSuffix>{{ input.suffixIcon }}</mat-icon>
      } @if(!input.readonly && control.value){
      <mat-icon matSuffix (click)="clearInput()">close</mat-icon>
      } @if(errorMessage){
      <mat-error>{{ errorMessage }}</mat-error>
      }
    </mat-form-field>
  `,
})
export class TextAreaComponent {
  readonly genericService = inject(GenericService);
  @Input() input!: IFormField;
  @Input() control: FormControl = new FormControl('');

  clearInput(): void {
    this.control.setValue('');
  }
}
