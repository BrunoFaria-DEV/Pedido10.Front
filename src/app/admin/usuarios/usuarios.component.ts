import { Component, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { UsuarioService } from 'app/services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [    
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  usuarios: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.error = null;

    this.usuarioService.GetAll().subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.usuarios = resposta.usuarios;
        } else {
          this.error = 'Não foi possível carregar os usuários.';
        }
        this.loading = false;
      },
      error: (erro) => {
        this.error = 'Ocorreu um erro na requisição.';
        console.error(erro);
        this.loading = false;
      },
    });
  }
}
