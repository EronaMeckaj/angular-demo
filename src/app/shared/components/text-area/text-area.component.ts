import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IFormField } from '../../models/i-form-field.interface';

@Component({
  selector: 'app-text-area',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-form-field [class]="input.inputClass" class="w-100">
      <mat-label>{{ input.label }}</mat-label>
      <textarea
        matInput
        [placeholder]="input.label || ''"
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
      <mat-icon matSuffix (click)="clearSearch()">close</mat-icon>
      }
    </mat-form-field>
  `,
})
export class TextAreaComponent {
  @Input() input!: IFormField;
  @Input() control: FormControl = new FormControl('');

  clearSearch(): void {
    this.control.setValue('');
  }
}
