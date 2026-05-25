import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CurriculaApiService } from '../../services/curricula-api.service';
import { Curriculum, CurriculumAudit, CurriculumStatus } from '../../models/curriculum.model';
import { CurriculumFormDialogComponent } from '../curriculum-form-dialog/curriculum-form-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-curriculum-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
  templateUrl: './curriculum-detail.component.html',
  styleUrl: './curriculum-detail.component.scss',
})
export class CurriculumDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(CurriculaApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  curriculum: Curriculum | null = null;
  audits: CurriculumAudit[] = [];
  auditTotal = 0;
  auditPage = 1;
  loading = false;
  auditLoading = false;

  auditColumns = ['performed_at', 'action', 'changed_fields', 'performed_by_name', 'reason'];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCurriculum(id);
  }

  loadCurriculum(id: number): void {
    this.loading = true;
    this.api.getCurriculumById(id).subscribe({
      next: (res) => { this.curriculum = res.data ?? null; this.loading = false; this.loadAudit(); },
      error: () => { this.loading = false; this.router.navigate(['/curricula']); },
    });
  }

  loadAudit(): void {
    if (!this.curriculum) return;
    this.auditLoading = true;
    this.api.getAudit(this.curriculum.curriculum_id, this.auditPage).subscribe({
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
    const ref = this.dialog.open(CurriculumFormDialogComponent, { width: '640px', data: this.curriculum });
    ref.afterClosed().subscribe((saved) => {
      if (saved) { this.loadCurriculum(this.curriculum!.curriculum_id); this.notify('แก้ไขหลักสูตรสำเร็จ'); }
    });
  }

  confirmDelete(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ยืนยันการยกเลิกหลักสูตร',
        message: `ต้องการยกเลิกหลักสูตร "${this.curriculum?.curriculum_name_th}" ใช่หรือไม่?`,
        confirmLabel: 'ยกเลิกหลักสูตร',
        danger: true,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.api.deleteCurriculum(this.curriculum!.curriculum_id).subscribe({
          next: () => { this.notify('ยกเลิกหลักสูตรแล้ว'); this.router.navigate(['/curricula']); },
          error: () => this.notify('เกิดข้อผิดพลาด', true),
        });
      }
    });
  }

  getStatusLabel(status: CurriculumStatus): string {
    return { ACTIVE: 'เปิดใช้งาน', DRAFT: 'ฉบับร่าง', INACTIVE: 'ยกเลิก' }[status] ?? status;
  }

  getStatusClass(status: CurriculumStatus): string {
    return { ACTIVE: 'chip-success', DRAFT: 'chip-warning', INACTIVE: 'chip-error' }[status] ?? '';
  }

  getActionLabel(action: string): string {
    return { INSERT: 'สร้าง', UPDATE: 'แก้ไข', DELETE: 'ลบ' }[action] ?? action;
  }

  back(): void { this.router.navigate(['/curricula']); }

  private notify(msg: string, error = false): void {
    this.snackBar.open(msg, 'ปิด', { duration: 3000, panelClass: error ? ['snack-error'] : ['snack-success'] });
  }
}
