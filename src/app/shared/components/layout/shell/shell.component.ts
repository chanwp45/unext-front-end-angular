import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../features/auth/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private sub!: Subscription;

  isMobile = false;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  navItems: NavItem[] = [
    { label: 'นักศึกษา',  icon: 'school',           route: '/students'  },
    { label: 'หลักสูตร',  icon: 'menu_book',         route: '/curricula' },
    { label: 'ผู้ใช้งาน', icon: 'manage_accounts',   route: '/users'     },
    { label: 'คณะ/สาขา', icon: 'account_balance',   route: '/faculties' },
  ];

  ngOnInit(): void {
    this.sub = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, '(max-width: 959px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;
        this.sidenavMode = this.isMobile ? 'over' : 'side';
        this.sidenavOpened = !this.isMobile;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  onNavClick(): void {
    if (this.isMobile) this.sidenav.close();
  }

  logout(): void {
    this.authService.logout();
  }
}
