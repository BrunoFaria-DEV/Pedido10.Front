import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthHelperServiceService } from '../../services/helpers/auth-helper-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    // ReactiveFormsModule,
    MatCardModule,
    // MatInputModule,
    // MatButtonModule,
    // MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    // MatSnackBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void { }
  
  constructor(private authHelperServiceService: AuthHelperServiceService) {}

  // injetor pode substituir o construtor para poucas injeções de dependencia
  // private authHelperServiceService = inject(AuthHelperServiceService);

  deslogar(){
    this.authHelperServiceService.deslogar();
  }
}
