import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurriculaApiService } from '../../services/curricula-api.service';
import { FacultiesApiService } from '../../../faculties/services/faculties-api.service';
import { Curriculum, CurriculumStatus } from '../../models/curriculum.model';
import { Faculty, Department } from '../../../faculties/models/faculty.model';

@Component({
  selector: 'app-curriculum-form-dialog',
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
  ],
  templateUrl: './curriculum-form-dialog.component.html',
  styleUrl: './curriculum-form-dialog.component.scss',
})
export class CurriculumFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(CurriculaApiService);
  private facultyApi = inject(FacultiesApiService);
  private dialogRef = inject(MatDialogRef<CurriculumFormDialogComponent>);

  isEdit = false;
  loading = false;
  faculties: Faculty[] = [];
  departments: Department[] = [];
  degreeLevels = ['ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก'];
  statusOptions: { value: CurriculumStatus; label: string }[] = [
    { value: 'DRAFT', label: 'ฉบับร่าง' },
    { value: 'ACTIVE', label: 'เปิดใช้งาน' },
    { value: 'INACTIVE', label: 'ยกเลิก' },
  ];

  form = this.fb.group({
    curriculum_name_th: ['', [Validators.required, Validators.maxLength(200)]],
    curriculum_name_en: ['', [Validators.required, Validators.maxLength(200)]],
    degree_level: ['', Validators.required],
    faculty_id: [null as number | null, Validators.required],
    department_id: [null as number | null, Validators.required],
    total_credits: [null as number | null, [Validators.required, Validators.min(60), Validators.max(180)]],
    duration_years: ['', Validators.required],
    effective_year: [null as number | null, [Validators.required, Validators.min(2500)]],
    accreditation_body: [''],
    status: ['DRAFT' as CurriculumStatus, Validators.required],
    description: [''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: Curriculum | null) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.facultyApi.getFaculties().subscribe((res) => {
      this.faculties = res.data ?? [];
    });
    if (this.data) {
      this.form.patchValue(this.data as never);
      this.onFacultyChange(this.data.faculty_id);
    }
    this.form.get('faculty_id')!.valueChanges.subscribe((id) => {
      if (id) this.onFacultyChange(id);
    });
  }

  onFacultyChange(facultyId: number): void {
    this.facultyApi.getDepartmentsByFaculty(facultyId).subscribe((res) => {
      this.departments = res.data ?? [];
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const value = this.form.getRawValue();
    const body = {
      ...value,
      faculty_id: value.faculty_id!,
      department_id: value.department_id!,
      total_credits: value.total_credits!,
      effective_year: value.effective_year!,
    };
    const request$ = this.isEdit
      ? this.api.updateCurriculum(this.data!.curriculum_id, body as never)
      : this.api.createCurriculum(body as never);

    request$.subscribe({
      next: () => { this.loading = false; this.dialogRef.close(true); },
      error: () => (this.loading = false),
    });
  }
}
