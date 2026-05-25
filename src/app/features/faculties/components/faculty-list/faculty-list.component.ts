import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { FacultiesApiService } from '../../services/faculties-api.service';
import { Faculty, Department } from '../../models/faculty.model';

interface FacultyRow extends Faculty {
  expanded: boolean;
  departments?: Department[];
  loadingDepts: boolean;
}

@Component({
  selector: 'app-faculty-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './faculty-list.component.html',
  styleUrl: './faculty-list.component.scss',
  animations: [
    trigger('expandRow', [
      state('collapsed', style({ height: '0', minHeight: '0', overflow: 'hidden', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ]),
  ],
})
export class FacultyListComponent implements OnInit {
  private api = inject(FacultiesApiService);

  displayedColumns = ['expand', 'code', 'name_th', 'name_en', 'dept_count'];

  faculties: FacultyRow[] = [];
  loading = false;
  expandedRow: FacultyRow | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.api.getFaculties().subscribe({
      next: (res) => {
        this.faculties = (res.data ?? []).map((f) => ({
          ...f,
          expanded: false,
          departments: undefined,
          loadingDepts: false,
        }));
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  toggleExpand(row: FacultyRow): void {
    if (this.expandedRow === row) {
      row.expanded = false;
      this.expandedRow = null;
      return;
    }
    if (this.expandedRow) {
      this.expandedRow.expanded = false;
    }
    row.expanded = true;
    this.expandedRow = row;
    if (!row.departments) {
      row.loadingDepts = true;
      this.api.getDepartmentsByFaculty(row.id).subscribe({
        next: (res) => {
          row.departments = res.data ?? [];
          row.loadingDepts = false;
        },
        error: () => (row.loadingDepts = false),
      });
    }
  }

  isExpanded(row: FacultyRow): string {
    return row.expanded ? 'expanded' : 'collapsed';
  }

  getFacultyColor(code: string): string {
    const colors = [
      'linear-gradient(135deg,#1565c0,#42a5f5)',
      'linear-gradient(135deg,#2e7d32,#66bb6a)',
      'linear-gradient(135deg,#7b1fa2,#ab47bc)',
      'linear-gradient(135deg,#e65100,#ffa726)',
      'linear-gradient(135deg,#c62828,#ef5350)',
      'linear-gradient(135deg,#00695c,#26a69a)',
      'linear-gradient(135deg,#283593,#5c6bc0)',
      'linear-gradient(135deg,#4e342e,#8d6e63)',
    ];
    let hash = 0;
    for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }
}
