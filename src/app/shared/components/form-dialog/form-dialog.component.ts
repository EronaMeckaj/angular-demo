import { Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { GenericFormComponent } from '../generic-form/generic-form.component';

@Component({
  selector: 'app-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    GenericFormComponent,
  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
  readonly dialogData = inject(MAT_DIALOG_DATA);
  readonly #dialogRef = inject(MatDialogRef<FormDialogComponent>);
  @ViewChild(GenericFormComponent) genericFormComponent!: GenericFormComponent;

  onSubmit() {
    const formData = this.genericFormComponent.getFormData();
    if (formData) {
      this.#dialogRef.close(formData);
    } else {
      this.genericFormComponent.genericForm.markAllAsTouched();
    }
  }
}
