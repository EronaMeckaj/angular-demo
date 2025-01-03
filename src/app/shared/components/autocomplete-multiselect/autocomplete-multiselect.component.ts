import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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

@Component({
  selector: 'app-autocomplete-multiselect',
  templateUrl: './autocomplete-multiselect.component.html',
  styleUrls: ['./autocomplete-multiselect.component.scss'],
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
    MatCheckboxModule
  ]
})
export class AutocompleteMultiselectComponent implements OnInit {
  announcer = inject(LiveAnnouncer);
  @Input() input!: IFormField;
  @Input() control: FormControl<IOption[] | null> = new FormControl<IOption[] | null>([]);

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredOptions$!: Observable<IOption[]>;
  selectedOptions: IOption[] = [];
  options$!: Observable<IOption[]>;

  ngOnInit() {
    this.options$ = this.getOptionsObservable();
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
  private getOptionsObservable(): Observable<IOption[]> {
    const options = this.input?.options;
    return options instanceof Observable
      ? options.pipe(map((data) => data || []))
      : new BehaviorSubject<IOption[]>(options || []).asObservable();
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

  private _filter(options: IOption[], selectedOptions: IOption[] | IOption | null): IOption[] {
    if (!selectedOptions) {
      return options;
    }

    const selectedArray = Array.isArray(selectedOptions)
      ? selectedOptions
      : [selectedOptions];
    const selectedValues = selectedArray.map(option => option.label.toLowerCase());

    return options.map(option => ({
      ...option,
      disabled: selectedValues.includes(option.label.toLowerCase()),
    }));
  }

}
