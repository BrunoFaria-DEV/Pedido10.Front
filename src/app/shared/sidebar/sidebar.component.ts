import { Component, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { PermissionsService } from 'app/services/permissions/permissions.service';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SidebarService } from 'app/services/layout/sidebar.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse, faCircleInfo, faPerson, faBox, faBagShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [  
    MatSidenavModule, 
    MatListModule, 
    MatIconModule,
    CommonModule,
    RouterLink,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnDestroy{
  faHouse = faHouse;
  faCircleInfo = faCircleInfo;
  faPerson = faPerson;
  faBox = faBox;
  faBagShopping = faBagShopping;

  sidebarVisible: boolean = false;
  private sidebarSubscription!: Subscription;

  constructor(
    private sidebarService: SidebarService, 
    private elRef: ElementRef,
    private permissionsService: PermissionsService
  ) {
    this.sidebarSubscription = this.sidebarService.sidebarVisible$.subscribe(
      (isVisible) => {
        this.sidebarVisible = isVisible;
      }
    );
  }

  hasRole(roles: string[], item?: string): boolean {
    console.log(`SidebarComponent - Tipos de Usuarios Permitidos em ${item}: ${roles}`)
    // return roles.some(role => this.permissionsService.userRoles.includes(role));
    return this.permissionsService.hasRole(roles);
  }

  // Capturar clique fora da sidebar
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    
    if (
      this.sidebarVisible && 
      !this.elRef.nativeElement.contains(event.target) &&
      !targetElement.closest('#sidepanel-toggler')  
    ) {
      this.sidebarService.closeSidebar();
    }
  }

  // Fechar sidebar ao clicar no botão de fechar
  closeSidebar() {
    this.sidebarService.closeSidebar();
  }

  ngOnDestroy(): void {
    this.sidebarSubscription.unsubscribe();
  }

}
