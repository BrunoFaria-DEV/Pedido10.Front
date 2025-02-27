import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from 'app/services/cliente.service';
import { FormaPgtoService } from 'app/services/forma-pgto.service';
import { PedidoService } from 'app/services/pedido.service';
import { ProductService } from 'app/services/produto.service';
import { minLengthArray } from 'app/services/validators/min-length-array';
@Component({
  selector: 'app-editar-pedidos',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule,
    RouterLink
  ],
  templateUrl: './editar-pedidos.component.html',
  styleUrl: './editar-pedidos.component.scss'
})
export class EditarPedidosComponent implements OnInit {
  pedidoForm!: FormGroup;
  title = 'Editar Pedido';
  id!: number;
  clientes: any[] = [];
  produtos: any[] = [];
  formasPgto: any[] = [];
  statusEntregaPedidos: any[] = [
    { status: 'D', description: 'Não Entregue' },
    { status: 'E', description: 'Entregue' }
  ];
  parcelas: any[] = [
    { status: 'D', description: 'Não Pago' },
    { status: 'P', description: 'Pago' }
  ];
  quantidadeParcelas: number = 1;
  vlrTotalPedido: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private _clienteService: ClienteService,
    private _produtoService: ProductService,
    private _formaPgtoService: FormaPgtoService,
    private _pedidoService: PedidoService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
    });

    this.pedidoForm = this.formBuilder.group({
      ID_Cliente: [null, [Validators.required]],
      VLR_Total_Pedido: [null, [Validators.min(0), Validators.pattern(/^\d{1,7}(\.\d{1,2})?$/)]],
      DT_Entrega: [Date.now, [Validators.required]],
      Status_Entrega_Pedido: [this.statusEntregaPedidos[0].status, [Validators.required]],
      Pedido_Produtos: this.formBuilder.array([], minLengthArray(1)),
      Parcelas: this.formBuilder.array([], minLengthArray(1)),
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

    this._formaPgtoService.getAll().subscribe({
      next: (response) => {
        this.formasPgto = response.result || response.data || response || [];
      },
      error: (error) => console.error('Erro ao buscar formas de pagamento:', error),
    });

    this.Pedido_Produtos.valueChanges.subscribe(() => {
      this.Parcelas.clear();
      this.calcularTotalPedido();
    });

    this._pedidoService.find(this.id).subscribe({
      next: (response) => {
        const pedido = response.result;
        console.log("Dados recebidos do pedido:", pedido);

        if (!pedido) return;

        this.pedidoForm.patchValue(pedido);

        this.Pedido_Produtos.clear();
        this.Parcelas.clear();

        pedido.Pedido_Produtos.forEach((produto: any) => {
          console.log(produto)
          this.Pedido_Produtos.push(this.criarProdutoForm(produto));
        });

        pedido.Parcelas.forEach((parcela: any) => {
          this.Parcelas.push(this.criarParcelaForm(parcela));
        });
      },
      error: (error) => {
        console.error("Erro ao buscar o pedido:", error);
      },
      complete: () => {
        console.log('Formulário após patchValue:', this.pedidoForm);
        // this.tipoCliente();
      }
    });
  }

  private criarProdutoForm(produto: any): FormGroup {
    return this.formBuilder.group({
      ID_Produto: [produto.ID_Produto, Validators.required],
      QTDE_Produto: [produto.QTDE_Produto, [Validators.required, Validators.min(1)]],
      VLR_Unitario_Produto: [produto.VLR_Unitario_Produto, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
      VLR_Total_Produto: [produto.VLR_Total_Produto, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
    });
  }
  
  private criarParcelaForm(parcela: any): FormGroup {
    return this.formBuilder.group({
      Numero_Parcela: [parcela.Numero_Parcela, Validators.required],
      DT_Vencimento: [parcela.DT_Vencimento, Validators.required],
      ID_Forma_PGTO: [parcela.ID_Forma_PGTO, Validators.required],
      Valor_Parcela: [parcela.Valor_Parcela, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
      Status_Parcela: [parcela.Status_Parcela, Validators.required],
      Valor_Pago_Parcela: [parcela.Valor_Pago_Parcela, [Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
      Data_Pagamento: [parcela.Data_Pagamento],
    });
  }

  get Pedido_Produtos(): FormArray {
    return this.pedidoForm.get('Pedido_Produtos') as FormArray;
  }
  get Parcelas(): FormArray {
    return this.pedidoForm.get('Parcelas') as FormArray;
  }

  atualizarQuantidadeParcelas(event: any) {
    this.quantidadeParcelas = event.target.value ? parseInt(event.target.value, 10) : 1;
  }

  getProximaData(numeroParcela: number): string {
    const hoje = new Date();
    const diaVencimento = 15; // Dia de vencimento fixo
    let mesVencimento = hoje.getMonth() + numeroParcela; // Adiciona meses

    let anoVencimento = hoje.getFullYear();
    if (mesVencimento > 11) {
      anoVencimento += Math.floor(mesVencimento / 12);
      mesVencimento = mesVencimento % 12;
    }

    const dataVencimento = new Date(anoVencimento, mesVencimento, diaVencimento);

    // Ajusta o dia se for maior que o último dia do mês
    const ultimoDiaDoMes = new Date(anoVencimento, mesVencimento + 1, 0).getDate();
    const diaFinal = Math.min(diaVencimento, ultimoDiaDoMes);

    return dataVencimento.toISOString().slice(0, 10); // Formato YYYY-MM-DD
  }

  adicionarProduto(): void {
    const produtoGroup = this.formBuilder.group({
      ID_Produto: [null, Validators.required],
      QTDE_Produto: [1, [Validators.required, Validators.min(1)]],
      VLR_Unitario_Produto: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
      VLR_Total_Produto: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
    });

    // this.Pedido_Produtos.push(produtoGroup);

    // const index = this.Pedido_Produtos.length - 1;

    // this.getProductInformations(index);

    // Atualiza o valor total automaticamente ao modificar quantidade ou valor unitário
    produtoGroup.get('QTDE_Produto')?.valueChanges.subscribe(() => this.calcularTotalProduto(produtoGroup));
    produtoGroup.get('VLR_Unitario_Produto')?.valueChanges.subscribe(() => this.calcularTotalProduto(produtoGroup));

    this.Pedido_Produtos.push(produtoGroup);
    this.Parcelas.clear();
    this.calcularTotalPedido(); 
  }

  adicionarParcelas(): void {
    this.Parcelas.clear(); 
    const valorTotalPedido = this.calcularTotalPedido();

    if (valorTotalPedido === 0) {
      alert("Adicione produtos ao pedido antes de gerar as parcelas.");
      return;
    }

    const valorParcela = valorTotalPedido / this.quantidadeParcelas;

    for (let i = 1; i <= this.quantidadeParcelas; i++) {
      const parcelaGroup = this.formBuilder.group({
        Numero_Parcela: [i, Validators.required],
        DT_Vencimento: [this.getProximaData(i), Validators.required],
        ID_Forma_PGTO: [null, Validators.required],
        Valor_Parcela: [parseFloat(valorParcela.toFixed(2)), [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
        Status_Parcela: [this.parcelas[0].status, Validators.required],
        Valor_Pago_Parcela: [null, [Validators.min(0), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)]],
        Data_Pagamento: [null]
      });
      this.Parcelas.push(parcelaGroup);
    }
  }

  removerProduto(index: number): void {
    this.Pedido_Produtos.removeAt(index);
    this.Parcelas.clear();
    this.calcularTotalPedido();
  }

  removerParcela(index: number): void {
    this.Parcelas.removeAt(index);
  }

  getProductInformations(i: number) {
    const pedidoProdutoFormArray = this.pedidoForm.get('Pedido_Produtos') as FormArray;
    const FromArrayProduto = pedidoProdutoFormArray.at(i);
    const FromArrayProdutoId: number = FromArrayProduto.get('ID_Produto')?.value;
    const produtoListItem = this.produtos.find( p => p.ID_Produto === FromArrayProdutoId )
    
    if (produtoListItem) {
      FromArrayProduto.get('VLR_Unitario_Produto')?.setValue(produtoListItem.Preco);
      FromArrayProduto.get('QTDE_Estoque')?.setValue(produtoListItem.Preco);
      console.log(produtoListItem ?? 'sem valor')
    } else {
      FromArrayProduto.get('VLR_Unitario_Produto')?.setValue(0);
      FromArrayProduto.get('QTDE_Estoque')?.setValue(0);
    }
  }

  calcularTotalProduto(produtoGroup: FormGroup): void {
    const quantidade = produtoGroup.get('QTDE_Produto')?.value || 0;
    const valorUnitario = produtoGroup.get('VLR_Unitario_Produto')?.value || 0;

    const total = quantidade * valorUnitario;
    produtoGroup.get('VLR_Total_Produto')?.setValue(parseFloat(total.toFixed(2)), { emitEvent: false });
  }

  calcularTotalPedido(): number {
    let total = 0;
    this.Pedido_Produtos.controls.forEach(control => {
      const produto = control as FormGroup;
      const valorProduto = Number(produto.get('VLR_Total_Produto')?.value) || 0;
      total += valorProduto;
    });

    this.vlrTotalPedido = total;
    return total;
  }
  

  onStatusParcelaChange(index: number): void {
    const parcelaFormGroup = this.Parcelas.at(index) as FormGroup;
    const statusParcela = parcelaFormGroup.get('Status_Parcela')?.value;

    if (statusParcela === 'P') {
      this.marcarParcelaComoPaga(index);
    } else if (statusParcela === 'D') {
      this.limparCamposParcela(index);
    }
  }

  marcarParcelaComoPaga(index: number): void {
    const parcelaFormGroup = this.Parcelas.at(index) as FormGroup;

    const valorParcela = parcelaFormGroup.get('Valor_Parcela')?.value;

    if (valorParcela !== null && valorParcela !== undefined) {
      parcelaFormGroup.get('Valor_Pago_Parcela')?.setValue(valorParcela);

      const dataAtual = new Date().toISOString().slice(0, 10);
      parcelaFormGroup.get('Data_Pagamento')?.setValue(dataAtual);

      parcelaFormGroup.get('Status_Parcela')?.setValue('P');
    } else {
      console.error('Valor da parcela não encontrado.');
    }
  }

  limparCamposParcela(index: number): void {
    const parcelaFormGroup = this.Parcelas.at(index) as FormGroup;

    parcelaFormGroup.get('Valor_Pago_Parcela')?.setValue(null);
    parcelaFormGroup.get('Data_Pagamento')?.setValue(null);
    //parcelaFormGroup.get('Status_Parcela')?.setValue('D');
  }

  onSubmit() {
    const valorTotalPedido = this.calcularTotalPedido();
  
    // Garante que o valor é um número antes parseFloat(de chamar to)Fixed
    if (!isNaN(valorTotalPedido)) {
      this.pedidoForm.get('VLR_Total_Pedido')?.setValue(parseFloat(valorTotalPedido.toFixed(2)));
    } else {
      console.error("Erro: valorTotalPedido não é um número válido", valorTotalPedido);
    }

    if (this.pedidoForm.valid) {
      const pedido = this.pedidoForm.getRawValue();

      this._pedidoService.updatePedido(this.id, pedido).subscribe({
        next: (response) => {
          console.log("Cliente adicionado com sucesso:", response);
          this._router.navigate(['/pedidos'], { queryParams: { sucesso: '1' } });
        },
        error: (error) => {
          if (error.status === 400) {
            const errors = error.error.errors;
            if (errors) {
              for (const field in errors) {
                if (this.pedidoForm.get(field)) {
                  this.pedidoForm.get(field)?.setErrors({ [field]: errors[field] });
                  this.pedidoForm.get(field)?.markAsTouched();
                }
              }
            }
          }
          else if (error.error && error.error.message) {
            console.error("Mensagem de erro do backend:", error.error.message);
            alert(error.error.message);
          } else {
            console.error("Erro desconhecido:", error);
            alert("Ocorreu um erro ao adicionar o pedido. Tente novamente mais tarde.");
          }
        }
      });
    } else {
      console.log('Formulário Inválido', this.pedidoForm.errors);
      this.pedidoForm.markAllAsTouched();
    }
    console.log(this.pedidoForm.value)
  }

  hasErrorProduto(index: number, campo: string, tipoErro: string) {
    const produtoFormGroup = this.pedidoForm.get('Pedido_Produtos') as FormArray;
    return produtoFormGroup.at(index).get(campo)?.hasError(tipoErro) && produtoFormGroup.at(index).get(campo)?.touched;
  }
}
