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
    // Inicializa o formulário com valores padrão e validações
    this.produtoForm = this.fb.group({
      Nome_Produto: ['', [Validators.required, Validators.maxLength(255)]], // Obrigatório
      Descricao: ['', Validators.maxLength(500)], // Opcional
      Custo_Producao: [null, [Validators.min(0)]], // Opcional, valor mínimo 0
      Margem_Lucro: [null, [Validators.min(0)]], // Opcional, valor mínimo 0
      Preco: [null, [Validators.required, Validators.min(0)]], // Obrigatório, valor mínimo 0
      QTDE_Estoque: [null, [Validators.required, Validators.min(0)]], // Obrigatório, valor mínimo 0
    });
  }

  onSubmit() {
    if (this.produtoForm.valid) {
      console.log('Produto Submetido', this.produtoForm.value);
      // Aqui você pode chamar o serviço para salvar os dados
      var produto = this.produtoForm.getRawValue() as IProduto;
      this._produtoService.addProduto(produto).subscribe((response) => {
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

    // logar() {
    //   if (this.formLogin.invalid) return;
  
    //   var usuario = this.formLogin.getRawValue() as IUsuario;
  
    //   this.authUserService.logar(usuario).subscribe((response) => {
    //     if (!response.sucesso) {
    //       this.snackBar.open(
    //         'Falha na autenticação', 'Usuário ou senha incorretos.', 
    //         { duration: 3000 }
    //       );
    //     }
    //     else {
    //       console.log(response)
    //     }
    //   });
    // }
}
