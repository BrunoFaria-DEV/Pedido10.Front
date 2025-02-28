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

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {
  produtos: any[] = [];
  title: string = "Produtos";

  constructor(
    private productService: ProductService, 
    private router: Router,
    private route: ActivatedRoute,
    private deleteAlertsService: DeleteAlertsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sucesso'] === '1') {
        Swal.fire({
          title: `Produto ${params["nome_produto"]} cadastrado!`,
          text: 'O produto foi cadastrado com sucesso.',
          icon: 'success',
          confirmButtonText: 'Confirmar'
        }).then(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sucesso: null },
            queryParamsHandling: 'merge' 
          });
        });
      }
      else if (params['sucesso'] === '2') {
        Swal.fire({
          title: `Produto ${params["nome_produto"]} atualizado!`,
          text: 'O produto foi atualizado com sucesso.',
          icon: 'success',
          confirmButtonText: 'Confirmar'
        }).then(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sucesso: null },
            queryParamsHandling: 'merge' 
          });
        });
      }
      else if (params['sucesso'] === '3') {
        Swal.fire({
          title: `Produto ${params["nome_produto"]} excluido!`,
          text: 'O produto foi excluido com sucesso.',
          icon: 'success',
          confirmButtonText: 'Confirmar'
        }).then(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sucesso: null },
            queryParamsHandling: 'merge' 
          });
        });
      }
    });
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.productService.getAll().subscribe( {
      next: (data) => {
      this.produtos = data.result;
      console.log(data.result)
    }});
  }

  editarProduto(id: number): void {
    this.router.navigate(['/produtos/editar', id]);
  }

  async excluirProduto(id: number) {
    try{
      const response = await this.deleteAlertsService.delete('Produto');

      if (response) {
        await lastValueFrom(this.productService.deleteProduto(id));
        Swal.fire({
          title: `Produto excluido!`,
          text: 'O produto foi excluido com sucesso.',
          icon: 'success',
          confirmButtonText: 'Confirmar'
        }).then(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sucesso: null },
            queryParamsHandling: 'merge' 
          });
        });
        this.carregarProdutos();
      }

    } catch(error) {
      console.error("Erro ao excluir:", error);
    }
  }
}