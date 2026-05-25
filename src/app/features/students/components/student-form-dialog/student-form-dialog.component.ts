import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
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
import { FacultiesApiService } from '../../../faculties/services/faculties-api.service';
import { CurriculaApiService } from '../../../curricula/services/curricula-api.service';
import { Student, Gender } from '../../models/student.model';
import { Curriculum } from '../../../curricula/models/curriculum.model';

@Component({
  selector: 'app-student-form-dialog',
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
  templateUrl: './student-form-dialog.component.html',
  styleUrl: './student-form-dialog.component.scss',
})
export class StudentFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(StudentsApiService);
  private curriculaApi = inject(CurriculaApiService);
  private dialogRef = inject(MatDialogRef<StudentFormDialogComponent>);

  isEdit = false;
  loading = false;
  curricula: Curriculum[] = [];
  maxDate = new Date();

  genderOptions: { value: Gender; label: string }[] = [
    { value: 'MALE', label: 'ชาย' },
    { value: 'FEMALE', label: 'หญิง' },
    { value: 'OTHER', label: 'อื่นๆ' },
  ];

  form = this.fb.group({
    national_id: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    title_th: ['', [Validators.required, Validators.maxLength(20)]],
    first_name_th: ['', [Validators.required, Validators.maxLength(100)]],
    last_name_th: ['', [Validators.required, Validators.maxLength(100)]],
    first_name_en: ['', [Validators.required, Validators.maxLength(100)]],
    last_name_en: ['', [Validators.required, Validators.maxLength(100)]],
    date_of_birth: [null as Date | null, Validators.required],
    gender: ['' as Gender, Validators.required],
    nationality: ['ไทย', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    phone: ['', [Validators.required, Validators.maxLength(20)]],
    address: ['', Validators.required],
    curriculum_id: [null as number | null, Validators.required],
    admission_year: [null as number | null, [Validators.required, Validators.min(2500)]],
    guardian_name: [''],
    guardian_phone: [''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: Student | null) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.curriculaApi.getCurricula({ status: 'ACTIVE', limit: 100 }).subscribe((res) => {
      this.curricula = res.data?.items ?? [];
    });
    if (this.data) {
      this.form.patchValue({
        ...this.data,
        curriculum_id: this.data.curriculum.curriculum_id,
        date_of_birth: this.data.date_of_birth ? new Date(this.data.date_of_birth) : null,
      });
      this.form.get('national_id')!.disable();
    }
  }

  getError(ctrl: AbstractControl | null, type: string): boolean {
    return !!(ctrl?.touched && ctrl?.hasError(type));
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const raw = this.form.getRawValue();
    const body = {
      ...raw,
      date_of_birth: raw.date_of_birth
        ? (raw.date_of_birth as Date).toISOString().split('T')[0]
        : '',
      curriculum_id: raw.curriculum_id!,
      admission_year: raw.admission_year!,
      gender: raw.gender as Gender,
    };

    const request$ = this.isEdit
      ? this.api.updateStudent(this.data!.student_id, body as never)
      : this.api.createStudent(body as never);

    request$.subscribe({
      next: () => { this.loading = false; this.dialogRef.close(true); },
      error: () => (this.loading = false),
    });
  }
}
