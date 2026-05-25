import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StudentsApiService } from '../../services/students-api.service';
import { Student, StudentStatus } from '../../models/student.model';

export interface StudentStatusDialogData {
  student: Student;
}

@Component({
  selector: 'app-student-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <!-- Header -->
    <div class="dialog-header header-status">
      <div class="dialog-header-icon">
        <mat-icon>swap_horiz</mat-icon>
      </div>
      <div class="dialog-title-group">
        <h2 mat-dialog-title>เปลี่ยนสถานะนักศึกษา</h2>
        <p class="dialog-subtitle">{{ data.student.first_name_th }} {{ data.student.last_name_th }}</p>
      </div>
      <button mat-icon-button mat-dialog-close class="dialog-close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-body">
      <div class="current-status-badge">
        <mat-icon>info_outline</mat-icon>
        <span>สถานะปัจจุบัน: <strong>{{ getStatusLabel(data.student.student_status) }}</strong></span>
      </div>
      <form [formGroup]="form" class="status-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>สถานะใหม่ *</mat-label>
          <mat-select formControlName="student_status">
            @for (opt of statusOptions; track opt.value) {
              <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
            }
          </mat-select>
          <mat-icon matSuffix>swap_horiz</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>วันที่มีผล</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="effective_date" />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>เหตุผล</mat-label>
          <textarea matInput formControlName="reason" rows="2"></textarea>
          <mat-icon matSuffix>notes</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>เลขที่เอกสาร</mat-label>
          <input matInput formControlName="document_ref" placeholder="LEAVE-2567-001" />
          <mat-icon matSuffix>folder_open</mat-icon>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close>ยกเลิก</button>
      <button mat-raised-button color="primary" class="dialog-submit-btn status-submit-btn"
        (click)="submit()" [disabled]="loading">
        @if (loading) { <mat-spinner diameter="18" /> } @else { บันทึกสถานะ }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .header-status {
      background: linear-gradient(135deg, #e65100 0%, #ff8f00 100%);
      box-shadow: 0 4px 16px rgba(230, 81, 0, 0.3);
    }
    .status-submit-btn {
      background: linear-gradient(135deg, #e65100, #ff8f00) !important;
      box-shadow: 0 4px 12px rgba(255, 143, 0, 0.4) !important;
    }
    .current-status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff8e1;
      border: 1px solid #ffe082;
      border-left: 4px solid #ff8f00;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
      font-size: 0.875rem;
      color: #e65100;
    }
    .current-status-badge mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .status-form { display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
  `],
})
export class StudentStatusDialogComponent {
  private fb = inject(FormBuilder);
  private api = inject(StudentsApiService);
  private dialogRef = inject(MatDialogRef<StudentStatusDialogComponent>);

  loading = false;

  statusOptions: { value: StudentStatus; label: string }[] = [
    { value: 'STUDYING',  label: 'กำลังศึกษา' },
    { value: 'LEAVE',     label: 'ลาพัก' },
    { value: 'RESIGNED',  label: 'ลาออก' },
    { value: 'GRADUATED', label: 'สำเร็จการศึกษา' },
    { value: 'EXPELLED',  label: 'พ้นสภาพ' },
  ];

  form = this.fb.group({
    student_status: ['' as StudentStatus, Validators.required],
    effective_date: [null as Date | null],
    reason: [''],
    document_ref: [''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: StudentStatusDialogData) {}

  getStatusLabel(status: StudentStatus): string {
    return this.statusOptions.find((o) => o.value === status)?.label ?? status;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const raw = this.form.getRawValue();
    const body = {
      student_status: raw.student_status!,
      effective_date: raw.effective_date
        ? (raw.effective_date as Date).toISOString().split('T')[0]
        : undefined,
      reason: raw.reason || undefined,
      document_ref: raw.document_ref || undefined,
    };
    this.api.updateStatus(this.data.student.student_id, body).subscribe({
      next: () => { this.loading = false; this.dialogRef.close(true); },
      error: () => (this.loading = false),
    });
  }
}
