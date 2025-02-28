import { Component, OnInit } from '@angular/core';
import { AuthHelperServiceService } from '../../services/helpers/auth-helper-service.service';
import { SidebarService } from 'app/services/layout/sidebar.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthUserService } from 'app/services/auth-user.service';

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
  nomeUsuario: string = "";

  ngOnInit(): void { 
    this.nomeUsuario = this._authUserService.obterUsuarioLogado?.Nome || "";
  }

  constructor(
    private authHelperServiceService: AuthHelperServiceService, 
    private sidebarService: SidebarService,
    private _authUserService: AuthUserService
  ) {}
  deslogar(){
    this.authHelperServiceService.deslogar();
  }
  
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}