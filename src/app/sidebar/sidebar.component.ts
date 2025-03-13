import { Component, ViewChild, HostListener } from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
  ],
  template: `
    <div class="app-container">
      <!-- Mobile Header -->
      <mat-toolbar class="mobile-header" *ngIf="isMobile">
        <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
          <mat-icon>menu</mat-icon>
        </button>
        <span>HealthCare Dashboard</span>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <!-- Sidebar -->
        <mat-sidenav
          #sidenav
          [mode]="isMobile ? 'over' : 'side'"
          [opened]="!isMobile"
          [class.collapsed]="isCollapsed && !isMobile"
          class="sidebar"
          [fixedInViewport]="true"
          [fixedTopGap]="isMobile ? 56 : 0"
        >
          <!-- Logo Section -->
          <div class="logo-section">
            <span class="logo-text" *ngIf="!isCollapsed || isMobile"
              >RendezVouz</span
            >
            <button
              *ngIf="!isMobile"
              mat-icon-button
              class="collapse-btn"
              (click)="toggleCollapse()"
            >
              <mat-icon>{{
                isCollapsed ? 'chevron_right' : 'chevron_left'
              }}</mat-icon>
            </button>
          </div>

          <!-- User Profile -->
          <div class="user-profile">
            <div class="avatar">
              <img
                src="https://ui-avatars.com/api/?name=Dr.+Smith&background=0D8ABC&color=fff"
                alt="User Avatar"
              />
            </div>
            <div class="user-details" *ngIf="!isCollapsed || isMobile">
              <!-- Add doctor name -->
              <h3>Dr. Smith</h3>
              <p>Cardiologist</p>
            </div>
          </div>

          <!-- Navigation -->
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle *ngIf="!isCollapsed || isMobile"
                >Dashboard</span
              >
            </a>

            <a
              mat-list-item
              routerLink="/settings"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              <mat-icon matListItemIcon>settings</mat-icon>
              <span matListItemTitle *ngIf="!isCollapsed || isMobile"
                >Settings</span
              >
            </a>
            <a mat-list-item (click)="logout()" class="end-item">
              <mat-icon matListItemIcon>exit_to_app</mat-icon>
              <span matListItemTitle *ngIf="!isCollapsed || isMobile"
                >Logout</span
              >
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content
          [style.marginLeft]="isMobile ? '0' : isCollapsed ? '70px' : '260px'"
        >
          <div class="content">
            <ng-content></ng-content>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }

      .sidenav-container {
        flex: 1;
        width: 100%;
      }

      .mobile-header {
        background: #3f51b5;
        color: white;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
      }

      .menu-button {
        margin-right: 16px;
      }

      .sidebar {
        width: 260px;
        background: white;
        border-right: 1px solid rgba(0, 0, 0, 0.12);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
      }

      .sidebar.collapsed {
        width: 70px;
      }

      .logo-section {
        height: 64px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        background: #3f51b5;
        color: white;
        position: relative;
      }

      .logo {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }

      .logo-text {
        font-size: 1.2rem;
        font-weight: 500;
        white-space: nowrap;
      }

      .collapse-btn {
        position: absolute;
        right: 4px;
        color: white;
      }

      .user-profile {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #4d63e0;
        flex-shrink: 0;
      }

      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .user-details {
        min-width: 0;
      }

      .user-details h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
        color: #333;
      }

      .user-details p {
        margin: 0;
        font-size: 0.8rem;
        color: #666;
      }

      mat-nav-list {
        padding: 8px;
      }

      .mat-mdc-list-item {
        margin: 4px 0;
        border-radius: 8px;
        height: 48px;
      }

      .mat-mdc-list-item:hover {
        background-color: rgb(224, 227, 244);
      }

      .mat-mdc-list-item.active[_ngcontent-ng-c2385442846] {
        background-color: rgb(186, 192, 236);
        color: #fafafa;
      }

      //   .mat-mdc-list-item.active .mat-icon {
      //     color: white;
      //   }

      //   .mat-icon {
      //     color: #3f51b5;
      //   }

      .mdc-list-item--with-leading-icon .mdc-list-item__start {
        color: rgb(75, 75, 80);
      }
      mat-divider {
        margin: 8px 0;
      }

      .content {
        padding: 24px;
        box-sizing: border-box;
        min-height: 100%;
      }

      @media (max-width: 768px) {
        .sidebar {
          position: fixed;
          top: 56px;
          left: 0;
          bottom: 0;
          width: 280px !important;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
          transform: translateX(0);
        }
        .content {
          padding-top: 80px;
        }

        mat-sidenav-content {
          margin-left: 0 !important;
        }

        ::ng-deep .mat-drawer-backdrop {
          position: fixed !important;
          top: 56px !important;
        }

        ::ng-deep .mat-drawer-transition .mat-drawer-content {
          transition: margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
    `,
  ],
})
export class SidebarComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  isCollapsed = false;

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  constructor(private authService: AuthService) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.sidenav) {
      if (this.isMobile) {
        this.sidenav.close();
      } else {
        this.sidenav.open();
      }
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();  
  }
  
}
