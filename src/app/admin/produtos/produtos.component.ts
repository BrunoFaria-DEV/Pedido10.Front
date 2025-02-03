import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService, Produto } from '../../services/produto.service';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {
  // displayedColumns: string[] = ['id', 'nome', 'descricao', 'custo', 'margem', 'preco', 'estoque', 'editar', 'deletar'];
  // produtos = new MatTableDataSource<Produto>();
  produtos: any[] = [];
  title: string = "Produtos";

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
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
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduto(id).subscribe(() => {
        this.carregarProdutos();
      });
    }
  }
}
