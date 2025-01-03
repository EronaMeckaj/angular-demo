import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-information-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ dialogData.title }}</h2>
    <mat-dialog-content class="mat-typography">
      <p>{{ dialogData.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button (click)="onConfirm()">Confirm</button>
    </mat-dialog-actions>
  `,
})
export class InformationDialogComponent {
  readonly dialogData = inject(MAT_DIALOG_DATA);
  readonly #dialogRef = inject(MatDialogRef<InformationDialogComponent>);

  onConfirm() {
    this.#dialogRef.close(true);
  }
}
