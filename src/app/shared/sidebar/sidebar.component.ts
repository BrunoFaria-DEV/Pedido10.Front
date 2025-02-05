import { Component, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SidebarService } from 'app/services/layout/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [  
    MatSidenavModule, 
    MatListModule, 
    MatIconModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnDestroy{
  userRoles = ['super-admin', 'admin', 'suporte', 'desenvolvimento'];

  sidebarVisible: boolean = false;
  private sidebarSubscription!: Subscription;

  constructor(private sidebarService: SidebarService, private elRef: ElementRef) {
    this.sidebarSubscription = this.sidebarService.sidebarVisible$.subscribe(
      (isVisible) => {
        this.sidebarVisible = isVisible;
      }
    );
  }

  hasRole(roles: string[]): boolean {
    return roles.some(role => this.userRoles.includes(role));
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
