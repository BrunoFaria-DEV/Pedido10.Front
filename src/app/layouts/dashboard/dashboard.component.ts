import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthHelperServiceService } from '../../services/helpers/auth-helper-service.service';
import { SidebarComponent } from 'app/shared/sidebar/sidebar.component';
import { HeaderComponent } from 'app/shared/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(private authHelperServiceService: AuthHelperServiceService, private renderer: Renderer2) {}
  
  ngOnInit(): void {
    this.renderer.addClass(document.body, 'app');
  }

  deslogar(){
    this.authHelperServiceService.deslogar();
  }
}
