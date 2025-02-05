import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService, Produto } from '../../services/produto.service';
import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import { DeleteAlertsService } from 'app/services/alerts/delete-alerts.service';
import { lastValueFrom } from 'rxjs';
import { ClienteService } from 'app/services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  title: string = "Clientes";

  constructor(
    private clienteService: ClienteService, 
    private router: Router,
    private route: ActivatedRoute,
    private deleteAlertsService: DeleteAlertsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sucesso'] === '1') {
        Swal.fire({
          title: 'Produto cadastrado!',
          text: 'O produto foi adicionado com sucesso.',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          // Após o fechamento do alerta, limpamos a URL removendo o parâmetro
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sucesso: null },
            queryParamsHandling: 'merge' // 'merge' irá manter outros parâmetros de query que possam existir
          });
        });
      }
    });
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.getAll().subscribe( {
      next: (data) => {
      this.clientes = data.result;
      console.log(data.result)
    }});
  }

  editarProduto(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }

  async excluirProduto(id: number) {
    try{
      const response = await this.deleteAlertsService.delete('Produto');

      if (response) {
        await lastValueFrom(this.clienteService.deleteCliente(id));
        this.carregarClientes();
      }

    } catch(error) {
      console.error("Erro ao excluir:", error);
    }
  }
}
