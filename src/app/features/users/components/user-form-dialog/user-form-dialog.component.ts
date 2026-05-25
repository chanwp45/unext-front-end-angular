import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersApiService } from '../../services/users-api.service';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-user-form-dialog',
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
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
})
export class UserFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(UsersApiService);
  private dialogRef = inject(MatDialogRef<UserFormDialogComponent>);

  isEdit = false;
  loading = false;
  showPassword = false;

  roleOptions: { value: UserRole; label: string; icon: string }[] = [
    { value: 'ADMIN', label: 'Admin', icon: 'admin_panel_settings' },
    { value: 'STAFF', label: 'Staff', icon: 'badge' },
    { value: 'STUDENT', label: 'Student', icon: 'school' },
    { value: 'MODERATOR', label: 'Moderator', icon: 'verified_user' },
    { value: 'USER', label: 'User', icon: 'person' },
  ];

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8), Validators.maxLength(100)]],
    role: ['STAFF' as UserRole, Validators.required],
    active: [true],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: User | null) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({ email: this.data.email, role: this.data.role, active: this.data.active });
      this.form.get('email')!.disable();
    } else {
      this.form.get('password')!.addValidators(Validators.required);
      this.form.get('password')!.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { password, role, active } = this.form.getRawValue();

    if (this.isEdit) {
      const body = {
        ...(password ? { password } : {}),
        role: role as UserRole,
        active: active ?? true,
      };
      this.api.updateUser(this.data!.id, body).subscribe({
        next: () => { this.loading = false; this.dialogRef.close(true); },
        error: () => (this.loading = false),
      });
    } else {
      const { email } = this.form.getRawValue();
      this.api.createUser({ email: email!, password: password!, role: role as UserRole }).subscribe({
        next: () => { this.loading = false; this.dialogRef.close(true); },
        error: () => (this.loading = false),
      });
    }
  }
}
