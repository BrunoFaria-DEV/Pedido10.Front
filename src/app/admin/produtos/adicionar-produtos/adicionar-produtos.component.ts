import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IProduto } from 'app/interfaces/IProduto';
import { ProductService } from 'app/services/produto.service';

@Component({
  selector: 'app-adicionar-produtos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './adicionar-produtos.component.html',
  styleUrls: ['./adicionar-produtos.component.scss']
})
export class AdicionarProdutosComponent implements OnInit {
  title = "Novo Produto";

  produtoForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private _produtoService: ProductService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      Nome_Produto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      Descricao: ['', [Validators.minLength(3), Validators.maxLength(150)]],
      Custo_Producao: [null, [Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
      Margem_Lucro: [null, [Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
      Preco: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
      QTDE_Estoque: [0, [Validators.required, Validators.min(0)]],
    });

    this.produtoForm.get('Custo_Producao')?.valueChanges.subscribe(() => this.calcularPreco());
    this.produtoForm.get('Margem_Lucro')?.valueChanges.subscribe(() => this.calcularPreco());
  }

  calcularPreco(): void {
    const custo = this.produtoForm.get('Custo_Producao')?.value;
    const margem = this.produtoForm.get('Margem_Lucro')?.value;

    if (custo !== null && margem !== null) {
      const preco = custo * (1 + margem / 100);
      this.produtoForm.get('Preco')?.setValue(preco.toFixed(2)); // Arredonda para 2 casas decimais
    }
    else if(custo !== null ) {
      const preco = custo;
      this.produtoForm.get('Preco')?.setValue(preco.toFixed(2)); 
    }
    else {
      this.produtoForm.get('Preco')?.setValue(0); 
    }
  }

  onSubmit() {
    if (this.produtoForm.valid) {
      var produtoForm = this.produtoForm.getRawValue() as IProduto;
      
      this._produtoService.addProduto(produtoForm).subscribe({
        next: (response) => {
          this._router.navigate(['/produtos'], { queryParams: { sucesso: '1' } });
        },
        error: (error) => {
          if (error.status === 400) {
            console.log('Erros de validação:');
            Object.keys(error.error.errors).forEach((campo) => {
              error.error.errors[campo].forEach((mensagem: string) => {
                console.log(`Campo: ${campo} - Erro: ${mensagem}`);
              });
            });
          }
        }
      });
    } else {
      this.produtoForm.markAllAsTouched();
    }
  }

  hasError(campo: string, tipoErro: string) {
    return this.produtoForm.get(campo)?.hasError(tipoErro) && this.produtoForm.get(campo)?.touched;
  }
}
