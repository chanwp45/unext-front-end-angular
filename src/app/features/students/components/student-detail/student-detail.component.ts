import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StudentsApiService } from '../../services/students-api.service';
import { Student, StudentStatus } from '../../models/student.model';
import { CurriculumAudit } from '../../../curricula/models/curriculum.model';
import { StudentFormDialogComponent } from '../student-form-dialog/student-form-dialog.component';
import { StudentStatusDialogComponent } from '../student-status-dialog/student-status-dialog.component';
import { StudentPhotoDialogComponent } from '../student-photo-dialog/student-photo-dialog.component';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss',
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(StudentsApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  student: Student | null = null;
  audits: CurriculumAudit[] = [];
  auditTotal = 0;
  auditPage = 1;
  loading = false;
  auditLoading = false;

  auditColumns = ['performed_at', 'action', 'changed_fields', 'performed_by_name', 'reason'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('studentId')!;
    this.loadStudent(id);
  }

  loadStudent(id: string): void {
    this.loading = true;
    this.api.getStudentById(id).subscribe({
      next: (res) => { this.student = res.data ?? null; this.loading = false; this.loadAudit(); },
      error: () => { this.loading = false; this.router.navigate(['/students']); },
    });
  }

  loadAudit(): void {
    if (!this.student) return;
    this.auditLoading = true;
    this.api.getAudit(this.student.student_id, this.auditPage).subscribe({
      next: (res) => {
        this.audits = res.data?.items ?? [];
        this.auditTotal = res.data?.pagination.total ?? 0;
        this.auditLoading = false;
      },
      error: () => (this.auditLoading = false),
    });
  }

  onAuditPage(e: PageEvent): void {
    this.auditPage = e.pageIndex + 1;
    this.loadAudit();
  }

  openEdit(): void {
    const ref = this.dialog.open(StudentFormDialogComponent, { width: '720px', data: this.student });
    ref.afterClosed().subscribe((saved) => {
      if (saved) { this.loadStudent(this.student!.student_id); this.notify('แก้ไขข้อมูลสำเร็จ'); }
    });
  }

  openStatusDialog(): void {
    const ref = this.dialog.open(StudentStatusDialogComponent, {
      width: '480px',
      data: { student: this.student },
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) { this.loadStudent(this.student!.student_id); this.notify('อัปเดตสถานะสำเร็จ'); }
    });
  }

  openPhotoDialog(): void {
    const ref = this.dialog.open(StudentPhotoDialogComponent, {
      width: '400px',
      data: { student: this.student },
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) { this.loadStudent(this.student!.student_id); this.notify('อัปเดตรูปภาพสำเร็จ'); }
    });
  }

  getStatusLabel(status: StudentStatus): string {
    const map: Record<StudentStatus, string> = {
      STUDYING: 'กำลังศึกษา', LEAVE: 'ลาพัก', RESIGNED: 'ลาออก',
      GRADUATED: 'สำเร็จการศึกษา', EXPELLED: 'พ้นสภาพ',
    };
    return map[status] ?? status;
  }

  getStatusClass(status: StudentStatus): string {
    const map: Record<StudentStatus, string> = {
      STUDYING: 'chip-success', LEAVE: 'chip-warning', RESIGNED: 'chip-error',
      GRADUATED: 'chip-info', EXPELLED: 'chip-error',
    };
    return map[status] ?? '';
  }

  getActionLabel(action: string): string {
    return { INSERT: 'สร้าง', UPDATE: 'แก้ไข', DELETE: 'ลบ' }[action] ?? action;
  }

  back(): void { this.router.navigate(['/students']); }

  private notify(msg: string, error = false): void {
    this.snackBar.open(msg, 'ปิด', { duration: 3000, panelClass: error ? ['snack-error'] : ['snack-success'] });
  }
}
