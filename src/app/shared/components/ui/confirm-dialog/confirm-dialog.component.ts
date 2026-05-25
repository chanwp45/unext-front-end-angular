import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <!-- Header -->
    <div class="dialog-header" [ngClass]="data.danger ? 'header-danger' : 'header-primary'">
      <div class="dialog-header-icon">
        <mat-icon>{{ data.danger ? 'warning' : 'help_outline' }}</mat-icon>
      </div>
      <div class="dialog-title-group">
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      <button mat-icon-button mat-dialog-close class="dialog-close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-body">
      <p class="confirm-message">{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close>{{ data.cancelLabel ?? 'ยกเลิก' }}</button>
      <button
        mat-raised-button
        class="dialog-submit-btn"
        [ngClass]="data.danger ? 'confirm-danger-btn' : 'confirm-primary-btn'"
        [mat-dialog-close]="true"
      >{{ data.confirmLabel ?? 'ยืนยัน' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .header-danger  {
      background: linear-gradient(135deg, #b71c1c 0%, #e53935 100%);
      box-shadow: 0 4px 16px rgba(183, 28, 28, 0.3);
    }
    .header-primary {
      background: linear-gradient(135deg, #1565c0 0%, #42a5f5 100%);
      box-shadow: 0 4px 16px rgba(21, 101, 192, 0.3);
    }
    .confirm-message {
      white-space: pre-line;
      color: #424242;
      line-height: 1.7;
      font-size: 0.9rem;
      margin: 0;
    }
    .confirm-danger-btn {
      background: linear-gradient(135deg, #b71c1c, #e53935) !important;
      box-shadow: 0 4px 12px rgba(229, 57, 53, 0.4) !important;
    }
    .confirm-primary-btn {
      background: linear-gradient(135deg, #1565c0, #42a5f5) !important;
      box-shadow: 0 4px 12px rgba(21, 101, 192, 0.4) !important;
    }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}
}
