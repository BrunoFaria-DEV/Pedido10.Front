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
      Preco: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
      QTDE_Estoque: [null, [Validators.min(0)]],
    });
  }

  // onSubmit() {
  //   if (this.produtoForm.valid) {
  //     console.log('Produto Submetido', this.produtoForm.value);
  //     // Aqui você pode chamar o serviço para salvar os dados
  //     var produto = this.produtoForm.getRawValue() as IProduto;
  //     this._produtoService.addProduto(produto).subscribe((response) => {
  //       if(!response.Success) {
  //         console.log('falha na requisição', produto)
  //       }
  //       else {
  //         console.log(response)
  //       }
  //     });
  //     this._router.navigate(['/produtos'], { queryParams: { sucesso: '1' } });
  //   } else {
  //     console.log('Formulário Inválido', this.produtoForm.errors);
  //     this.produtoForm.markAllAsTouched(); // Marca os campos para exibir erros
  //   }
  // }

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
