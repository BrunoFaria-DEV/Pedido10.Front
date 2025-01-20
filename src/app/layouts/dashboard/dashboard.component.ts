import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthHelperServiceService } from '../../services/helpers/auth-helper-service.service';
import { SidebarComponent } from 'app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void { }
  
  constructor(private authHelperServiceService: AuthHelperServiceService) {}

  deslogar(){
    this.authHelperServiceService.deslogar();
  }
}
