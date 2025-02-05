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
    private route: ActivatedRoute
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

  excluirProduto(id: number): void {
    Swal.fire({
      title: 'Deseja Excluir esse Produto?',
      text: 'O produto será excluido permanentemente do sistema!',
      icon: 'warning',
      confirmButtonText: 'Ok',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("O Produto foi excluido com sucesso!", "", "success");
          this.productService.deleteProduto(id).subscribe(() => {
            this.carregarProdutos();
          });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
    // if (confirm('Tem certeza que deseja excluir este produto?')) {
    //   this.productService.deleteProduto(id).subscribe(() => {
    //     this.carregarProdutos();
    //   });
    // }
  }
}
