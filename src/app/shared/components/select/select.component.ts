import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith, shareReplay, take } from 'rxjs/operators';
import { IOption } from '../../models/i-option.interface';
import { IFormField } from '../../models/i-form-field.interface';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-select',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  template: `
    <mat-form-field
      [appearance]="input.appearance"
      [class]="input.inputClass"
      class="w-100"
    >
      <mat-label>{{ input.label }}</mat-label>
      <mat-select [formControl]="control" [multiple]="input.multiselect">
        @if(input.selectAll && input.multiselect){
        <mat-checkbox
          [checked]="isAllSelected$ | async"
          (change)="toggleAllSelection($event.checked)"
        >
          Select All
        </mat-checkbox>
        } @for (option of options$ | async; track option) {
        <mat-option [value]="option.value">
          {{ option.label }}
        </mat-option>
        }
      </mat-select>
      @if (input.hint) {
      <mat-hint>{{ input.hint }}</mat-hint>
      }
    </mat-form-field>
  `,
})
export class SelectComponent implements OnInit {
  readonly #genericService = inject(GenericService);

  @Input() input!: IFormField;
  @Input() control: FormControl = new FormControl('');

  options$: Observable<IOption[]> = new BehaviorSubject<IOption[]>([]);
  isAllSelected$: Observable<boolean> = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.setupObservables();
  }

  private setupObservables(): void {
    this.options$ = this.#genericService
      .getOptionsObservable(this.input.options)
      .pipe(shareReplay(1));

    this.isAllSelected$ = combineLatest([
      this.control.valueChanges.pipe(startWith(this.control.value || [])),
      this.options$,
    ]).pipe(
      map(([selectedValues, options]) =>
        Array.isArray(selectedValues)
          ? options.length > 0 && selectedValues.length === options.length
          : false
      ),
      shareReplay(1)
    );

    this.options$
      .pipe(
        take(1),
        map((options) => this.getFilteredValue(this.control.value, options))
      )
      .subscribe((filteredValues) => {
        this.control.setValue(filteredValues, { emitEvent: false });
      });
  }

  private getFilteredValue(value: any, options: IOption[]): any {
    const isMultiSelect = this.input?.multiselect;

    if (isMultiSelect) {
      const currentValue = Array.isArray(value) ? value : [];
      return currentValue.filter((val) =>
        options.some((option) => option.value === val)
      );
    } else {
      return options.some((option) => option.value === value) ? value : null;
    }
  }

  toggleAllSelection(selectAll: boolean): void {
    this.options$
      .pipe(
        take(1),
        map((options) => (selectAll ? options.map((o) => o.value) : []))
      )
      .subscribe((values) => this.control.setValue(values));
  }
}
