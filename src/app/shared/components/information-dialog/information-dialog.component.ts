import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-information-dialog',
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ dialogData.title | translate }}</h2>
    <mat-dialog-content class="mat-typography">
      <p>{{ dialogData.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        {{ dialogData.cancelButtonText ?? 'GENERAL.cancel' | translate }}
      </button>
      <button mat-button (click)="onConfirm()">
        {{ dialogData.submitButtonText ?? 'GENERAL.submit' | translate }}
      </button>
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
