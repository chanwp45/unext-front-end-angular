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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CurriculaApiService } from '../../services/curricula-api.service';
import { Curriculum, CurriculumFilter, CurriculumStatus } from '../../models/curriculum.model';
import { CurriculumFormDialogComponent } from '../curriculum-form-dialog/curriculum-form-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-curriculum-list',
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
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  templateUrl: './curriculum-list.component.html',
  styleUrl: './curriculum-list.component.scss',
})
export class CurriculumListComponent implements OnInit {
  private api = inject(CurriculaApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  displayedColumns = [
    'curriculum_code',
    'curriculum_name_th',
    'degree_level',
    'faculty_name',
    'total_credits',
    'status',
    'actions',
  ];

  curricula: Curriculum[] = [];
  totalItems = 0;
  page = 1;
  pageSize = 20;
  loading = false;

  filterForm = this.fb.group({
    keyword: [''],
    status: [''],
    degreeLevel: [''],
  });

  statusOptions: { value: CurriculumStatus | ''; label: string }[] = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'ACTIVE', label: 'เปิดใช้งาน' },
    { value: 'DRAFT', label: 'ฉบับร่าง' },
    { value: 'INACTIVE', label: 'ยกเลิก' },
  ];

  degreeLevels = ['ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก'];

  ngOnInit(): void {
    this.loadData();
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.page = 1;
        this.loadData();
      });
  }

  loadData(): void {
    this.loading = true;
    const { keyword, status, degreeLevel } = this.filterForm.value;
    const filter: CurriculumFilter = {
      page: this.page,
      limit: this.pageSize,
      ...(keyword && { keyword }),
      ...(status && { status: status as CurriculumStatus }),
      ...(degreeLevel && { degreeLevel }),
    };
    this.api.getCurricula(filter).subscribe({
      next: (res) => {
        this.curricula = res.data?.items ?? [];
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

  openAddDialog(): void {
    const ref = this.dialog.open(CurriculumFormDialogComponent, { width: '640px', data: null });
    ref.afterClosed().subscribe((saved) => { if (saved) { this.loadData(); this.notify('เพิ่มหลักสูตรสำเร็จ'); } });
  }

  openEditDialog(curriculum: Curriculum): void {
    const ref = this.dialog.open(CurriculumFormDialogComponent, { width: '640px', data: curriculum });
    ref.afterClosed().subscribe((saved) => { if (saved) { this.loadData(); this.notify('แก้ไขหลักสูตรสำเร็จ'); } });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/curricula', id]);
  }

  confirmDelete(curriculum: Curriculum): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ยืนยันการยกเลิกหลักสูตร',
        message: `ต้องการยกเลิกหลักสูตร "${curriculum.curriculum_name_th}" ใช่หรือไม่?\nหลักสูตรจะถูกเปลี่ยนสถานะเป็น "ยกเลิก" และจะไม่ปรากฏในรายการหลักสูตรที่ใช้งานอยู่`,
        confirmLabel: 'ยกเลิกหลักสูตร',
        cancelLabel: 'ไม่',
        danger: true,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.api.deleteCurriculum(curriculum.curriculum_id).subscribe({
          next: () => { this.loadData(); this.notify('ยกเลิกหลักสูตรแล้ว'); },
          error: () => this.notify('เกิดข้อผิดพลาด', true),
        });
      }
    });
  }

  getStatusChipClass(status: CurriculumStatus): string {
    return { ACTIVE: 'chip-success', DRAFT: 'chip-warning', INACTIVE: 'chip-error' }[status] ?? '';
  }

  getStatusLabel(status: CurriculumStatus): string {
    return { ACTIVE: 'เปิดใช้งาน', DRAFT: 'ฉบับร่าง', INACTIVE: 'ยกเลิก' }[status] ?? status;
  }

  private notify(msg: string, error = false): void {
    this.snackBar.open(msg, 'ปิด', {
      duration: 3000,
      panelClass: error ? ['snack-error'] : ['snack-success'],
    });
  }
}
