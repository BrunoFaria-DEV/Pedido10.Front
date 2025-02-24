import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from 'app/services/cliente.service';
import { ProductService } from 'app/services/produto.service';

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
export class AdicionarPedidosComponent implements OnInit {
  pedidoForm!: FormGroup;
  title = 'Novo Pedido';
  clientes: any[] = [];
  produtos: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private _clienteService: ClienteService,
    private _produtoService: ProductService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.pedidoForm = this.formBuilder.group({
      cliente: [null, [Validators.required]],
      Pedido_Produtos: this.formBuilder.array([]),
    });

    this._clienteService.getAll().subscribe({
      next: (response) => {
        this.clientes = response.result || response.data || response || [];
      },
      error: (error) => console.error('Erro ao buscar clientes:', error),
    });

    this._produtoService.getAll().subscribe({
      next: (response) => {
        this.produtos = response.result || response.data || response || [];
      },
      error: (error) => console.error('Erro ao buscar produtos:', error),
    });
  }

  get Pedido_Produtos(): FormArray {
    return this.pedidoForm.get('Pedido_Produtos') as FormArray;
  }

  adicionarProduto(): void {
    const produtoGroup = this.formBuilder.group({
      ID_Produto: [null, Validators.required],
      QTDE_Produto: [1, [Validators.required, Validators.min(1)]],
      VLR_Unitario_Produto: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
      VLR_Total_Produto: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
    });

    // Atualiza o valor total automaticamente ao modificar quantidade ou valor unitário
    produtoGroup.get('QTDE_Produto')?.valueChanges.subscribe(() => this.calcularTotal(produtoGroup));
    produtoGroup.get('VLR_Unitario_Produto')?.valueChanges.subscribe(() => this.calcularTotal(produtoGroup));

    this.Pedido_Produtos.push(produtoGroup);
  }

  removerProduto(index: number): void {
    this.Pedido_Produtos.removeAt(index);
  }

  calcularTotal(produtoGroup: FormGroup): void {
    const quantidade = produtoGroup.get('QTDE_Produto')?.value || 0;
    const valorUnitario = produtoGroup.get('VLR_Unitario_Produto')?.value || 0;

    const total = quantidade * valorUnitario;
    produtoGroup.get('VLR_Total_Produto')?.setValue(total.toFixed(2), { emitEvent: false });
  }

  finalizarVenda(): void {
    console.log(this.pedidoForm.value);
  }

  hasError(campo: string, tipoErro: string): boolean {
    const controle = this.pedidoForm.get(campo);
    return controle ? controle.hasError(tipoErro) && controle.touched : false;
  }

  // hasErrorProduto(index: number, campo: string, tipoErro: string): boolean {
  //   const produtoFormGroup = this.Pedido_Produtos.at(index);
  //   if (!produtoFormGroup) return false;

  //   const controle = produtoFormGroup.get(campo);
  //   return controle ? controle.hasError(tipoErro) && controle.touched : false;
  // }

  hasErrorProduto(index: number, campo: string, tipoErro: string) {
    const produtoFormGroup = this.pedidoForm.get('Pedido_Produtos') as FormArray;
    return produtoFormGroup.at(index).get(campo)?.hasError(tipoErro) && produtoFormGroup.at(index).get(campo)?.touched;
  }
}
