import { Component, OnInit } from '@angular/core';
import { AuthHelperServiceService } from '../../services/helpers/auth-helper-service.service';
import { SidebarService } from 'app/services/layout/sidebar.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  faRightFromBracket = faRightFromBracket;

  ngOnInit(): void { }

  constructor(private authHelperServiceService: AuthHelperServiceService, private sidebarService: SidebarService) {}
  deslogar(){
    this.authHelperServiceService.deslogar();
  }
  
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
