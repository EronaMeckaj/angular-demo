import { Component, Input, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IFormField } from '../../models/i-form-field.interface';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-text',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    @let errorMessage = genericService.getErrorMessage(control, input);
    <mat-form-field
      [appearance]="input.appearance"
      [class]="input.inputClass"
      class="w-100"
    >
      <mat-label>{{ input.label }}</mat-label>
      <input
        matInput
        [placeholder]="input.label || ''"
        [formControl]="control"
        [name]="input.name"
        type="text"
        [readonly]="input.readonly"
      />
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
export class TextComponent {
  readonly genericService = inject(GenericService);
  @Input() input!: IFormField;
  @Input() control: FormControl = new FormControl('');

  clearInput(): void {
    this.control.setValue('');
  }
}
