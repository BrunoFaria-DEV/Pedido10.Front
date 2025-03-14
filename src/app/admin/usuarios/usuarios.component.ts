import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { MatToolbarModule } from '@angular/material/toolbar';

import { UsuarioService } from 'app/services/usuario.service';
import { CommonModule } from '@angular/common';
import { DeleteAlertsService } from 'app/services/alerts/delete-alerts.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  usuarios: any[] = [];
  title: string = "Usuarios";
  errorMsg = "";

  constructor(
    private usuarioService: UsuarioService, 
    private router: Router,
    private route: ActivatedRoute,
    private deleteAlertsService: DeleteAlertsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sucesso'] === '1') {
        Swal.fire({
          title: 'Usuario cadastrado!',
          text: 'O produto foi adicionado com sucesso.',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sucesso: null },
            queryParamsHandling: 'merge'
          });
        });
      }
    });
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data.result;
        console.log(this.usuarios)
      },
      error: (err: HttpErrorResponse) => {
        let error = '';
        if (err.status === 400) {
          error = 'Clietnes não encontrados';
        }
        this.errorMsg = error
      }
    });
  }

  editarUsuario(id: number): void {
    this.router.navigate(['/usuarios/editar', id]);
  }

  banirUsuario(id: number): void {
    this.carregarUsuarios();
  }

  async excluirUsuario(id: number) {
    try{
      const response = await this.deleteAlertsService.delete('Usuario');

      if (response) {
        await lastValueFrom(this.usuarioService.deleteUsuario(id));
        this.carregarUsuarios();
      }

    } catch(error) {
      console.error("Erro ao excluir:", error);
    }
  }
}