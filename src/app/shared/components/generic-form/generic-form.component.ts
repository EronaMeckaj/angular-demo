import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { TextComponent } from '../text/text.component';
import { ControlType } from '../../enums/control-type.enum';
import { FormControlPipe } from '../../pipes/form-control.pipe';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    // SelectComponent,
    MatIconModule,
    TranslateModule,
    TextComponent,
    // CheckboxComponent,
    // DateRangeComponent,
    // DateComponent,
    FormControlPipe,
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.scss',
})
export class GenericFormComponent implements OnInit {
  readonly #formBuilder = inject(FormBuilder);
  @Input() dataSource: any[] = [];
  @Input() editData: any;
  // @Input() button: any;
  // @Input() buttonGroup: any;
  // @Output() onFormSubmit = new EventEmitter<any>();
  // @Output() buttonActionType = new EventEmitter<any>();
  // @Output() fieldChange = new EventEmitter<{ name: string; value: any }>();

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
    console.log(this.genericForm, " this.genericForm")
  }

  private createControl(input: any): any {
    switch (input.controlType) {
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
      console.log(this.editData, "this.editData?.[input.name]")
      initialValue = this.editData?.[input.name] || input.value || '';
    }
    return new FormControl(initialValue, input.validators || []);
  }

  updateFormArray(event: any): void {
    const formArray = this.genericForm?.get(event.name) as FormArray;

    if (formArray && formArray instanceof FormArray) {
      while (formArray.length) {
        formArray.removeAt(0);
      }
      event.value.forEach((value: any) => {
        formArray.push(this.#formBuilder.control(value));
      });
      // this.emitChange(event.name, event.value);
    }
    // this.emitChange(event.name, event.value);
  }

  getErrorMessage(fieldName: string, input: any): string {
    const control = this.genericForm.get(fieldName);

    if (!control || !control.errors) {
      return '';
    }

    const errorMessages: { [key in keyof typeof control.errors]: string } = {
      required: `${input.requiredLabel || input.name} is required`,
      pattern: `Invalid pattern`,
      minlength: `Minimum length is ${control.errors['minlength']?.requiredLength}`,
      min: `Value must be at least ${control.errors['min']?.min}`,
      max: `Value must not exceed ${control.errors['max']?.max}`,
    };

    const errorKey = Object.keys(
      control.errors
    )[0] as keyof typeof control.errors;
    return errorMessages[errorKey] || 'Invalid field value';
  }

  onSubmit() {
    if (!this.genericForm.valid) {
      this.genericForm.markAllAsTouched();
    } else {
      console.log(this.genericForm.value, "this.genericForm.value")
      // this.onFormSubmit.emit(this.genericForm.value);
    }
  }
}
