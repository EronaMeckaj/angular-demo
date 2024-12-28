import { ValidatorFn } from '@angular/forms';
import { ControlType } from '../enums/control-type.enum';
import { Observable } from 'rxjs';
import { IOption } from './i-option.interface';

export interface IFormField {
    key?: string;
    id?: string;
    label?: string;
    value?: any;
    name: string;
    containerClass?: string | string[];
    inputClass?: string | string[];
    options?: IOption[] | Observable<IOption[]>;
    validators?: ValidatorFn[];
    readonly?: boolean;
    multiselect?: boolean;
    selectAll?: boolean;
    controlType: ControlType;
    requiredLabel?: string;
    searchEnabled?: boolean;
    appearance?: any;
    enableSuffixIcon?: boolean;
    suffixIcon?: string;
    startDatePlaceholder?: string;
    endDatePlaceholder?: string;
    hint?: string;
    startControlName?: string;
    endControlName?: string;
    disabled?: boolean;
}
