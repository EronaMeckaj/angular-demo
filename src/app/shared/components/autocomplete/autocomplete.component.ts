import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  Observable,
  startWith,
  map,
  BehaviorSubject,
  switchMap,
  of,
} from 'rxjs';
import { IFormField } from '../../models/i-form-field.interface';
import { IOption } from '../../models/i-option.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-autocomplete',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIconModule,
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
        type="text"
        [placeholder]="input.placeholder!"
        [attr.aria-label]="input.label"
        matInput
        [formControl]="control"
        [matAutocomplete]="auto"
      />
      @if(control.value){
      <button
        mat-icon-button
        matSuffix
        aria-label="Clear"
        (click)="clearInput()"
      >
        <mat-icon>clear</mat-icon>
      </button>
      }
      <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn">
        @for (option of filteredOptions$ | async; track option) {
        <mat-option [value]="option">{{ option.label }}</mat-option>
        }
      </mat-autocomplete>
      @if (input.hint) {
      <mat-hint>{{ input.hint }}</mat-hint>
      } @if(errorMessage){
      <mat-error>{{ errorMessage }}</mat-error>
      }
    </mat-form-field>
  `,
})
export class AutocompleteComponent implements OnInit {
  readonly genericService = inject(GenericService);
  @Input() input!: IFormField;
  @Input() control = new FormControl<string | IOption>('');
  filteredOptions$!: Observable<IOption[]>;

  options$!: Observable<IOption[]>;

  ngOnInit() {
    this.options$ = this.genericService.getOptionsObservable(
      this.input.options
    );

    this.filteredOptions$ = this.control.valueChanges.pipe(
      startWith(this.control.value || ''),
      switchMap((value) => {
        return this.options$.pipe(
          map((options) => {
            if (typeof value === 'string') {
              const defaultOption = options.find(
                (option) => option.value === value
              );
              if (defaultOption) {
                this.control.setValue(defaultOption, { emitEvent: false });
              }
            }
            const key = typeof value === 'string' ? value : value?.label;
            return key ? this._filter(key, options) : options.slice();
          })
        );
      })
    );
  }

  private _filter(name: string, options: IOption[]): IOption[] {
    const filterValue = name.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: IOption): string {
    return option && option.label ? option.label : '';
  }

  clearInput(): void {
    this.control.reset();
  }
}
