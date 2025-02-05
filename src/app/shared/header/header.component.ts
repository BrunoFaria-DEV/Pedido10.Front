import { Component, OnInit } from '@angular/core';
import { AuthHelperServiceService } from '../../services/helpers/auth-helper-service.service';
import { SidebarService } from 'app/services/layout/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  ngOnInit(): void { }

  constructor(private authHelperServiceService: AuthHelperServiceService, private sidebarService: SidebarService) {}
  deslogar(){
    this.authHelperServiceService.deslogar();
  }
  
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
