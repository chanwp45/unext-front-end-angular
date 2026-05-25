import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentsApiService } from '../../services/students-api.service';
import { Student } from '../../models/student.model';

export interface StudentPhotoDialogData {
  student: Student;
}

@Component({
  selector: 'app-student-photo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <!-- Header -->
    <div class="dialog-header header-photo">
      <div class="dialog-header-icon">
        <mat-icon>add_a_photo</mat-icon>
      </div>
      <div class="dialog-title-group">
        <h2 mat-dialog-title>อัปเดตรูปภาพ</h2>
        <p class="dialog-subtitle">{{ data.student.first_name_th }} {{ data.student.last_name_th }}</p>
      </div>
      <button mat-icon-button mat-dialog-close class="dialog-close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-body">
      @if (previewUrl) {
        <div class="preview-wrap">
          <img [src]="previewUrl" alt="preview" class="preview-img"
            (error)="previewError = true" [class.hidden]="previewError" />
          @if (previewError) {
            <div class="preview-error">
              <mat-icon>broken_image</mat-icon>
              <span>ไม่สามารถโหลดรูปได้</span>
            </div>
          }
        </div>
      } @else {
        <div class="preview-placeholder">
          <mat-icon>person</mat-icon>
          <span>ยังไม่มีรูปภาพ</span>
        </div>
      }

      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>URL รูปภาพ</mat-label>
          <input matInput formControlName="photo_url" placeholder="https://..." (input)="previewError = false" />
          <mat-icon matSuffix>link</mat-icon>
          @if (form.controls.photo_url.hasError('required')) {
            <mat-error>กรุณากรอก URL รูปภาพ</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close>ยกเลิก</button>
      <button mat-raised-button color="primary" class="dialog-submit-btn photo-submit-btn"
        (click)="submit()" [disabled]="loading">
        @if (loading) { <mat-spinner diameter="18" /> } @else { บันทึกรูปภาพ }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .header-photo {
      background: linear-gradient(135deg, #0277bd 0%, #29b6f6 100%);
      box-shadow: 0 4px 16px rgba(2, 119, 189, 0.3);
    }
    .photo-submit-btn {
      background: linear-gradient(135deg, #0277bd, #29b6f6) !important;
      box-shadow: 0 4px 12px rgba(41, 182, 246, 0.4) !important;
    }
    .preview-wrap {
      text-align: center;
      margin-bottom: 16px;
    }
    .preview-img {
      width: 140px; height: 140px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #e3f2fd;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      &.hidden { display: none; }
    }
    .preview-error, .preview-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 24px;
      color: #b0bec5;
      font-size: 0.85rem;
    }
    .preview-error mat-icon, .preview-placeholder mat-icon {
      font-size: 48px; width: 48px; height: 48px;
    }
    .full-width { width: 100%; min-width: 340px; }
  `],
})
export class StudentPhotoDialogComponent {
  private fb = inject(FormBuilder);
  private api = inject(StudentsApiService);
  private dialogRef = inject(MatDialogRef<StudentPhotoDialogComponent>);

  loading = false;
  previewError = false;

  form = this.fb.group({
    photo_url: ['', Validators.required],
  });

  get previewUrl(): string { return this.form.value.photo_url ?? ''; }

  constructor(@Inject(MAT_DIALOG_DATA) public data: StudentPhotoDialogData) {
    this.form.patchValue({ photo_url: data.student.photo_url ?? '' });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.api.updatePhoto(this.data.student.student_id, this.form.value.photo_url!).subscribe({
      next: () => { this.loading = false; this.dialogRef.close(true); },
      error: () => (this.loading = false),
    });
  }
}
