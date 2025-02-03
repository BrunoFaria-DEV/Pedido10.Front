import { Component, OnInit } from '@angular/core';
import { ProductService } from 'app/services/produto.service';

@Component({
  selector: 'app-adicionar-produtos',
  standalone: true,
  imports: [],
  templateUrl: './adicionar-produtos.component.html',
  styleUrl: './adicionar-produtos.component.scss'
})
export class AdicionarProdutosComponent {

  
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    
  }
}
