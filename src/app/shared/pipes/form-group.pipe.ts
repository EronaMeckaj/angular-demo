import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Pipe({
    name: 'formGroup',
})
export class FormGroupPipe implements PipeTransform {
    transform(value: AbstractControl | null): FormGroup {
        return value instanceof FormGroup ? value : new FormGroup({});
    }
}
