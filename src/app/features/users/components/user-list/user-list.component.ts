import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UsersApiService } from '../../services/users-api.service';
import { User, UserRole } from '../../models/user.model';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
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
    MatSlideToggleModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private api = inject(UsersApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  displayedColumns = ['avatar', 'email', 'role', 'active', 'created_at', 'actions'];

  users: User[] = [];
  totalItems = 0;
  page = 1;
  pageSize = 20;
  loading = false;

  filterForm = this.fb.group({ keyword: [''] });

  roleOptions: { value: UserRole | ''; label: string }[] = [
    { value: '', label: 'ทุกบทบาท' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'STAFF', label: 'Staff' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'MODERATOR', label: 'Moderator' },
    { value: 'USER', label: 'User' },
  ];

  ngOnInit(): void {
    this.loadData();
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => { this.page = 1; this.loadData(); });
  }

  loadData(): void {
    this.loading = true;
    this.api.getUsers(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.data?.items ?? [];
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
    const ref = this.dialog.open(UserFormDialogComponent, { width: '480px', data: null });
    ref.afterClosed().subscribe((saved) => { if (saved) { this.loadData(); this.notify('เพิ่มผู้ใช้งานสำเร็จ'); } });
  }

  openEditDialog(user: User): void {
    const ref = this.dialog.open(UserFormDialogComponent, { width: '480px', data: user });
    ref.afterClosed().subscribe((saved) => { if (saved) { this.loadData(); this.notify('แก้ไขผู้ใช้งานสำเร็จ'); } });
  }

  confirmDelete(user: User): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ยืนยันการลบผู้ใช้งาน',
        message: `ต้องการลบผู้ใช้งาน "${user.email}" ใช่หรือไม่?\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`,
        confirmLabel: 'ลบผู้ใช้งาน',
        cancelLabel: 'ยกเลิก',
        danger: true,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.api.deleteUser(user.id).subscribe({
          next: () => { this.loadData(); this.notify('ลบผู้ใช้งานแล้ว'); },
          error: () => this.notify('เกิดข้อผิดพลาด', true),
        });
      }
    });
  }

  getRoleChipClass(role: UserRole): string {
    const map: Record<UserRole, string> = {
      ADMIN: 'chip-admin',
      STAFF: 'chip-staff',
      STUDENT: 'chip-student',
      MODERATOR: 'chip-moderator',
      USER: 'chip-user',
    };
    return map[role] ?? '';
  }

  getRoleLabel(role: UserRole): string {
    const map: Record<UserRole, string> = {
      ADMIN: 'Admin',
      STAFF: 'Staff',
      STUDENT: 'Student',
      MODERATOR: 'Moderator',
      USER: 'User',
    };
    return map[role] ?? role;
  }

  getAvatarLetter(email: string): string {
    return email?.charAt(0).toUpperCase() ?? '?';
  }

  private notify(msg: string, error = false): void {
    this.snackBar.open(msg, 'ปิด', {
      duration: 3000,
      panelClass: error ? ['snack-error'] : ['snack-success'],
    });
  }
}
