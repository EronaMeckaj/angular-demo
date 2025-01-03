import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { TextComponent } from '../text/text.component';
import { ControlType } from '../../enums/control-type.enum';
import { FormControlPipe } from '../../pipes/form-control.pipe';
import { SelectComponent } from '../select/select.component';
import { IFormField } from '../../models/i-form-field.interface';
import { DateRangeComponent } from '../date-range/date-range.component';
import { FormGroupPipe } from '../../pipes/form-group.pipe';
import { DatePickerComponent } from '../datepicker/datepicker.component';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { AutocompleteMultiselectComponent } from '../autocomplete-multiselect/autocomplete-multiselect.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { TextAreaComponent } from '../text-area/text-area.component';
import { NumberComponent } from '../number/number.component';

@Component({
  selector: 'app-generic-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SelectComponent,
    MatIconModule,
    TranslateModule,
    TextComponent,
    FormControlPipe,
    DateRangeComponent,
    FormGroupPipe,
    DatePickerComponent,
    AutocompleteComponent,
    AutocompleteMultiselectComponent,
    CheckboxComponent,
    TextAreaComponent,
    NumberComponent,
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.scss',
})
export class GenericFormComponent implements OnInit {
  readonly #formBuilder = inject(FormBuilder);
  @Input() dataSource: IFormField[] = [];
  @Input() editData: any;
  @Input() showButtons: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() showSubmitButton: boolean = true;
  @Input() cancelButtonText: string = 'Cancel';
  @Input() submitButtonText: string = 'Save';

  genericForm!: FormGroup;
  controlType: typeof ControlType = ControlType;

  ngOnInit() {
    if (this.dataSource) {
      this.initializeForm();
    }
  }

  private initializeForm() {
    const formGroupConfig = this.dataSource.reduce((acc, input) => {
      acc[input.name] = this.createControl(input);
      return acc;
    }, {} as { [key: string]: any });
    this.genericForm = this.#formBuilder.group(formGroupConfig);
  }

  private createControl(input: any): any {
    switch (input.controlType) {
      case ControlType.dateRange:
        return this.createFormGroupForDateRange(input);
      default:
        return this.createFormControl(input);
    }
  }

  private createFormControl(input: any): FormControl {
    let initialValue: any;
    if (
      (input.controlType === this.controlType.select && input.multiselect) ||
      input.controlType === this.controlType.autocompleteMultiselect
    ) {
      initialValue = this.editData?.[input.name] || input.value || [];
      if (!Array.isArray(initialValue)) {
        initialValue = [initialValue];
      }
    } else {
      initialValue = this.editData?.[input.name] || input.value || '';
    }
    return new FormControl(initialValue, input.validators || []);
  }

  private createFormGroupForDateRange(input: any): FormGroup {
    const startDate =
      this.editData?.[input.name]?.startDate || input.value?.startDate || null;
    const endDate =
      this.editData?.[input.name]?.endDate || input.value?.endDate || null;

    return this.#formBuilder.group(
      {
        [input.startControlName]: [startDate, input.startDateValidators || []],
        [input.endControlName]: [endDate, input.endDateValidators || []],
      }
    );
  }

  getFormData() {
    return this.genericForm.valid ? this.genericForm.value : null;
  }

  onSubmit() {
    if (!this.genericForm.valid) {
      this.genericForm.markAllAsTouched();
    } else {
      console.log(this.genericForm.value, 'this.genericForm.value');
    }
  }
}
