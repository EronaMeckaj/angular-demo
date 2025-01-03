import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IFormField } from '../../models/i-form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-number',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-form-field [class]="input.inputClass">
      <mat-label> {{ input.label }} </mat-label>
      <input
        matInput
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        [formControl]="control"
        [readonly]="input.readonly"
      />
      @if (input.enableSuffixIcon && !control.value) {
      <mat-icon matSuffix>{{ input.suffixIcon }}</mat-icon>
      } @if (input.hint) {
      <mat-hint>{{ input.hint }}</mat-hint>
      } @if (!input.readonly && control.value) {
      <mat-icon matSuffix (click)="clearInput()">close</mat-icon>
      }
    </mat-form-field>
  `,
})
export class NumberComponent {
  @Input() input!: IFormField;
  @Input() control: FormControl = new FormControl('');

  clearInput(): void {
    this.control.setValue('');
  }
}
