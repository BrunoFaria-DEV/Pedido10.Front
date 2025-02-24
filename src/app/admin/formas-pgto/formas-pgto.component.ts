import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { DeleteAlertsService } from 'app/services/alerts/delete-alerts.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { FormaPgtoService } from 'app/services/forma-pgto.service';

@Component({
  selector: 'app-formas-pgto',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    // MatToolbarModule,
    // MatTableModule,
    // MatIconModule
  ],
  templateUrl: './formas-pgto.component.html',
  styleUrl: './formas-pgto.component.scss'
})
export class FormasPgtoComponent {
  formaPgtos: any[] = [];
  title: string = "FormaPgtos";
  errorMsg = "";

  constructor(
    private formaPgtoService: FormaPgtoService, 
    private router: Router,
    private route: ActivatedRoute,
    private deleteAlertsService: DeleteAlertsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sucesso'] === '1') {
        Swal.fire({
          title: 'FormaPgto cadastrado!',
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
    this.carregarFormaPgtos();
  }

  carregarFormaPgtos() {
    this.formaPgtoService.getAll().subscribe({
      next: (data) => {
        this.formaPgtos = data.result;
        console.log(this.formaPgtos)
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

  editarFormaPgto(id: number): void {
    this.router.navigate(['/formas-pgto/editar', id]);
  }

  banirFormaPgto(id: number): void {
    this.carregarFormaPgtos();
  }

  async excluirFormaPgto(id: number) {
    try{
      const response = await this.deleteAlertsService.delete('FormaPgto');

      if (response) {
        await lastValueFrom(this.formaPgtoService.deleteFormaPgto(id));
        this.carregarFormaPgtos();
      }

    } catch(error) {
      console.error("Erro ao excluir:", error);
    }
  }
}