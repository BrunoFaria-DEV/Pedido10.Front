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
export class EditarProdutosComponent  implements OnInit {
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
    // Captura o ID da URL
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));

      // Inicializa o formulário antes de buscar os dados
      this.produtoForm = this.fb.group({
        Nome_Produto: ['', [Validators.required, Validators.maxLength(255)]],
        Descricao: ['', Validators.maxLength(500)],
        Custo_Producao: [null, [Validators.min(0)]],
        Margem_Lucro: [null, [Validators.min(0)]],
        Preco: [null, [Validators.required, Validators.min(0)]],
        QTDE_Estoque: [null, [Validators.required, Validators.min(0)]],
      });

      // Busca os dados do produto e preenche o formulário
      this._produtoService.find(this.id).subscribe(produto => {
        console.log("Dados do produto recebidos:", produto.produto.Result);
        if (produto.produto.Success) {
          this.produtoForm.patchValue(produto.produto.Result);
        }
      });
    });
  }

  onSubmit() {
    if (this.produtoForm.valid) {
      console.log('Produto Submetido', this.produtoForm.value);
      // Aqui você pode chamar o serviço para salvar os dados
      var produto = this.produtoForm.getRawValue() as IProduto;
      this._produtoService.updateProduto(this.id, produto).subscribe((response) => {
        if(!response.Success) {
          console.log('falha na requisição', produto)
        }
        else {
          console.log(response)
        }
      });
      this._router.navigate(['/produtos'], { queryParams: { sucesso: '1' } });
    } else {
      console.log('Formulário Inválido', this.produtoForm.errors);
      this.produtoForm.markAllAsTouched(); // Marca os campos para exibir erros
    }
  }
}