import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, Observable } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { IFormField } from '../../models/i-form-field.interface';
import { IOption } from '../../models/i-option.interface';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { GenericService } from '../../services/generic.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-autocomplete-multiselect',
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatCheckboxModule,
    TranslatePipe,
  ],
  template: `
    @let errorMessage = genericService.getErrorMessage(control, input);
    <mat-form-field [class]="input.inputClass" class="w-100">
      <mat-label>{{ input.label | translate }}</mat-label>
      <mat-chip-grid #chipGrid>
        @for (selectedOption of selectedOptions; track selectedOption) {
        <mat-chip-row (removed)="remove(selectedOption)">
          {{ selectedOption.label }}
          <button matChipRemove>
            <mat-icon>cancel</mat-icon>
          </button>
        </mat-chip-row>
        }
      </mat-chip-grid>
      <input
        [placeholder]="input.placeholder ?? '' | translate"
        [formControl]="control"
        [matChipInputFor]="chipGrid"
        [matAutocomplete]="auto"
        [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
        (matChipInputTokenEnd)="add($event)"
      />
      <mat-autocomplete
        #auto="matAutocomplete"
        (optionSelected)="selected($event)"
      >
        @for (option of filteredOptions$ | async; let idx = $index; track idx; )
        {
        <mat-option [value]="option" [disabled]="option.disabled">{{
          option.label
        }}</mat-option>
        }
      </mat-autocomplete>
      @if(input.hint){
      <mat-hint>{{ input.hint | translate }}</mat-hint>
      } 
      @if(errorMessage){
      <mat-error>{{ errorMessage }}</mat-error>
      }
    </mat-form-field>
  `,
})
export class AutocompleteMultiselectComponent implements OnInit {
  announcer = inject(LiveAnnouncer);
  readonly genericService = inject(GenericService);

  @Input() input!: IFormField;
  @Input() control: FormControl<IOption[] | null> = new FormControl<
    IOption[] | null
  >([]);

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredOptions$!: Observable<IOption[]>;
  selectedOptions: IOption[] = [];
  options$!: Observable<IOption[]>;

  ngOnInit() {
    this.options$ = this.genericService.getOptionsObservable(
      this.input.options
    );
    this.selectedOptions = this.control.value || [];
    this.filteredOptions$ = this.control.valueChanges.pipe(
      startWith(this.selectedOptions),
      switchMap((selectedOptions: IOption[] | null) =>
        this.options$.pipe(
          map((options: IOption[]) => this._filter(options, selectedOptions))
        )
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const newOption: IOption = { label: value, value };
      this.selectedOptions.push(newOption);
      this.control.setValue(this.selectedOptions);
    }
    event.chipInput!.clear();
  }

  remove(option: IOption): void {
    const index = this.selectedOptions.indexOf(option);
    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
      this.control.setValue(this.selectedOptions);
      this.announcer.announce(`Removed ${option.label}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedOption: IOption = event.option.value;
    this.selectedOptions.push(selectedOption);
    this.control.setValue(this.selectedOptions);
    event.option.deselect();
  }

  private _filter(
    options: IOption[],
    selectedOptions: IOption[] | IOption | null
  ): IOption[] {
    if (!selectedOptions) {
      return options;
    }

    const selectedArray = Array.isArray(selectedOptions)
      ? selectedOptions
      : [selectedOptions];
    const selectedValues = selectedArray.map((option) =>
      option.label.toLowerCase()
    );

    return options.map((option) => ({
      ...option,
      disabled: selectedValues.includes(option.label.toLowerCase()),
    }));
  }
}
