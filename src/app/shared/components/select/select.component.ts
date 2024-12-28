import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith, shareReplay, take } from 'rxjs/operators';
import { IOption } from '../../models/i-option.interface';
import { IFormField } from '../../models/i-form-field.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
})
export class SelectComponent implements OnInit {
  @Input() selectConfig!: IFormField;
  @Input() control: FormControl = new FormControl('');

  options$: Observable<IOption[]> = new BehaviorSubject<IOption[]>([]);
  isAllSelected$: Observable<boolean> = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.setupObservables();
  }

  private setupObservables(): void {
    this.options$ = this.getOptionsObservable().pipe(shareReplay(1));

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

  private getOptionsObservable(): Observable<IOption[]> {
    const options = this.selectConfig?.options;
    return options instanceof Observable
      ? options.pipe(map((data) => data || []))
      : new BehaviorSubject(options || []).asObservable();
  }

  private getFilteredValue(value: any, options: IOption[]): any {
    const isMultiSelect = this.selectConfig?.multiselect;

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