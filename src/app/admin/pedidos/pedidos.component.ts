import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import { DeleteAlertsService } from 'app/services/alerts/delete-alerts.service';
import { lastValueFrom } from 'rxjs';
import { PedidoService } from 'app/services/pedido.service';
import { ClienteService } from 'app/services/cliente.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  clientes: any[] = [];
  title: string = "Pedidos";

  constructor(
    private pedidoService: PedidoService, 
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService, 
    private deleteAlertsService: DeleteAlertsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sucesso'] === '1') {
        Swal.fire({
          title: 'Pedido cadastrado!',
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
    this.carregarPedidos();
    this.carregarClientes();
  }

  carregarPedidos(): void {
    this.pedidoService.getAll().subscribe( {
      next: (data) => {
      this.pedidos = data.result;
      console.log(data.result)
    }});
  }

  carregarClientes() {
    this.clienteService.getAll().subscribe({
      next: (data) => this.clientes = data.result,
      error: (err: HttpErrorResponse) => {
        let error = '';
        if (err.status === 400) {
          error = 'Clientes não encontrados';
        }
      }
    });
  }

  getClienteNome(idCliente: number): string {
    const cliente = this.clientes.find(cliente => cliente.ID_Cliente === idCliente);
    return cliente ? cliente.Nome : 'Cliente não encontrado'; // Ou qualquer valor padrão
  }

  editarPedido(id: number): void {
    this.router.navigate(['/pedidos/editar', id]);
  }

  async excluirPedido(id: number) {
    try{
      const response = await this.deleteAlertsService.delete('Pedido');

      if (response) {
        await lastValueFrom(this.pedidoService.deletePedido(id));
        this.carregarPedidos();
      }

    } catch(error) {
      console.error("Erro ao excluir:", error);
    }
  }
}