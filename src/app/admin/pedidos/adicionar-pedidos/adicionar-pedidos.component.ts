import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './adicionar-pedidos.component.html',
  styleUrl: './adicionar-pedidos.component.scss'
})
export class AdicionarPedidosComponent {
  pedidoForm: FormGroup;
  title = "Novo Pedido";
  
  constructor(private formBuilder: FormBuilder)
  {
    this.pedidoForm = this.formBuilder.group({
      cliente: [null, [Validators.required]],
      produtos: this.formBuilder.array([])
    });
  }

  get produtos(): FormArray 
  {
    return this.pedidoForm.get('produtos') as FormArray;
  }

  adicionarProduto() 
  {
    this.produtos.push(this.formBuilder.group({
      produto: [''],
      quantidade: [''],
      preco: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]]
    }));
    // this.cdr.detectChanges();
  }

  removerProduto(index: number) 
  {
    this.produtos.removeAt(index);
  }

  finalizarVenda() 
  {
    console.log(this.pedidoForm.value);
  }


  hasError(campo: string, tipoErro: string) {
    return this.pedidoForm.get(campo)?.hasError(tipoErro) && this.pedidoForm.get(campo)?.touched;
  }

  hasErrorProduto(index: number, campo: string, tipoErro: string) {
    const produtoFormGroup = this.pedidoForm.get('produtos') as FormArray;
    return produtoFormGroup.at(index).get(campo)?.hasError(tipoErro) && produtoFormGroup.at(index).get(campo)?.touched;
  }
}