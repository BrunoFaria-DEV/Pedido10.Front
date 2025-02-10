import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IProduto } from 'app/interfaces/IProduto';
import { ProductService } from 'app/services/produto.service';

@Component({
  selector: 'app-editar-produtos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './editar-produtos.component.html',
  styleUrl: './editar-produtos.component.scss'
})
export class EditarProdutosComponent implements OnInit {
  title = "Editar Produto";
  id!: number;
  produtoForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private _produtoService: ProductService,
    private _router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
  
      this.produtoForm = this.fb.group({
        Nome_Produto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        Descricao: ['', [Validators.minLength(3), Validators.maxLength(150)]],
        Custo_Producao: [null, [Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
        Margem_Lucro: [null, [Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
        Preco: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
        QTDE_Estoque: [null, [Validators.min(0)]],
      });
  
      this._produtoService.find(this.id).subscribe(produto => {
        if (produto.produto.Success) {
          this.produtoForm.patchValue(produto.produto.Result);
        }
      });
    });
  }
  

  onSubmit() {
    if (this.produtoForm.valid) {
      var produtoForm = this.produtoForm.getRawValue() as IProduto;
      
      this._produtoService.updateProduto(this.id, produtoForm).subscribe({
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