import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
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
import { DateRangeComponent } from "../date-range/date-range.component";
import { FormGroupPipe } from '../../pipes/form-group.pipe';
import { DatePickerComponent } from '../datepicker/datepicker.component';

@Component({
  selector: 'app-generic-form',
  standalone: true,
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
    DatePickerComponent
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.scss',
})
export class GenericFormComponent implements OnInit {
  readonly #formBuilder = inject(FormBuilder);
  @Input() dataSource: IFormField[] = [];
  @Input() editData: any;
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
    console.log(this.genericForm, "this.genericForm")
  }

  private createControl(input: any): any {
    switch (input.controlType) {
      case ControlType.dateRange:
        return this.createFormGroup(input);
      default:
        return this.createFormControl(input);
    }
  }

  private createFormControl(input: any): FormControl {
    let initialValue: any;
    if (input.controlType === this.controlType.select && input.multiselect) {
      initialValue = this.editData?.[input.name] || input.value || [];
      if (!Array.isArray(initialValue)) {
        initialValue = [initialValue];
      }
    } else {
      initialValue = this.editData?.[input.name] || input.value || '';
    }
    return new FormControl(initialValue, input.validators || []);
  }

  private createFormGroup(input: any): FormGroup {
    const startDate = this.editData?.[input.name]?.startDate || input.value?.startDate || null;
    const endDate = this.editData?.[input.name]?.endDate || input.value?.endDate || null;

    return this.#formBuilder.group({
      [input.startControlName]: [startDate, input.validators?.startDate || []],
      [input.endControlName]: [endDate, input.validators?.endDate || []],
    });
  }

  onSubmit() {
    if (!this.genericForm.valid) {
      this.genericForm.markAllAsTouched();
    } else {
      console.log(this.genericForm.value, "this.genericForm.value")
    }
  }
}
