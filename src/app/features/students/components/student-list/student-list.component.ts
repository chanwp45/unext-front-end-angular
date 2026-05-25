import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { StudentsApiService } from '../../services/students-api.service';
import { Student, StudentFilter, StudentStatus } from '../../models/student.model';
import { StudentFormDialogComponent } from '../student-form-dialog/student-form-dialog.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
})
export class StudentListComponent implements OnInit {
  private api = inject(StudentsApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  displayedColumns = ['student_id', 'name_th', 'curriculum', 'admission_year', 'student_status', 'actions'];

  students: Student[] = [];
  totalItems = 0;
  page = 1;
  pageSize = 20;
  loading = false;

  filterForm = this.fb.group({
    keyword: [''],
    status: [''],
  });

  statusOptions: { value: StudentStatus | ''; label: string }[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'STUDYING', label: 'กำลังศึกษา' },
    { value: 'LEAVE', label: 'ลาพัก' },
    { value: 'RESIGNED', label: 'ลาออก' },
    { value: 'GRADUATED', label: 'สำเร็จการศึกษา' },
    { value: 'EXPELLED', label: 'พ้นสภาพ' },
  ];

  ngOnInit(): void {
    this.loadData();
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => { this.page = 1; this.loadData(); });
  }

  loadData(): void {
    this.loading = true;
    const { keyword, status } = this.filterForm.value;
    const filter: StudentFilter = {
      page: this.page,
      limit: this.pageSize,
      ...(keyword && { keyword }),
      ...(status && { status: status as StudentStatus }),
    };
    this.api.getStudents(filter).subscribe({
      next: (res) => {
        this.students = res.data?.items ?? [];
        this.totalItems = res.data?.pagination.total ?? 0;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onPageChange(e: PageEvent): void {
    this.page = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.loadData();
  }

  openRegisterDialog(): void {
    const ref = this.dialog.open(StudentFormDialogComponent, { width: '720px', data: null });
    ref.afterClosed().subscribe((saved) => {
      if (saved) { this.loadData(); this.notify('รับสมัครนักศึกษาสำเร็จ'); }
    });
  }

  viewDetail(studentId: string): void {
    this.router.navigate(['/students', studentId]);
  }

  getStatusLabel(status: StudentStatus): string {
    const map: Record<StudentStatus, string> = {
      STUDYING: 'กำลังศึกษา',
      LEAVE: 'ลาพัก',
      RESIGNED: 'ลาออก',
      GRADUATED: 'สำเร็จการศึกษา',
      EXPELLED: 'พ้นสภาพ',
    };
    return map[status] ?? status;
  }

  getStatusClass(status: StudentStatus): string {
    const map: Record<StudentStatus, string> = {
      STUDYING: 'chip-success',
      LEAVE: 'chip-warning',
      RESIGNED: 'chip-error',
      GRADUATED: 'chip-info',
      EXPELLED: 'chip-error',
    };
    return map[status] ?? '';
  }

  private notify(msg: string, error = false): void {
    this.snackBar.open(msg, 'ปิด', { duration: 3000, panelClass: error ? ['snack-error'] : ['snack-success'] });
  }
}
