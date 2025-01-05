import { Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { GenericFormComponent } from '../generic-form/generic-form.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    GenericFormComponent,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title>{{ dialogData.title | translate }}</h2>
    <mat-dialog-content class="mat-typography">
      <app-generic-form
        [dataSource]="dialogData.formModel"
        [editData]="dialogData.editData"
        [showButtons]="dialogData.showFormButtons"
      ></app-generic-form>
    </mat-dialog-content>
    @if(!dialogData.showFormButtons){
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        {{ dialogData.cancelButtonText ?? 'GENERAL.cancel' | translate }}
      </button>
      <button mat-button (click)="onSubmit()">
        {{ dialogData.submitButtonText ?? 'GENERAL.submit' | translate }}
      </button>
    </mat-dialog-actions>
    }
  `,
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
