import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ICliente } from 'app/interfaces/ICliente';
import { ClienteService } from 'app/services/cliente.service';

import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { CidadeService } from 'app/services/cidade.service';



@Component({
  selector: 'app-adicionar-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgSelectModule
  ],
  templateUrl: './adicionar-clientes.component.html',
  styleUrl: './adicionar-clientes.component.scss'
})
export class AdicionarClientesComponent implements OnInit {
  title = "Novo Cliente";
  clienteForm!: FormGroup;

  cidadeForm!: FormGroup;
  cidades: any[] = [];  // Armazena as cidades filtradas
  buscaCidades$ = new Subject<string>();  // Campo de busca reativo
  loading = false;  // Para indicar o carregamento

  constructor(
    private fb: FormBuilder, 
    private _clienteService: ClienteService,
    private _router: Router,
    private cidadeService: CidadeService
  ) {}

  ngOnInit(): void {
    this.cidadeForm = this.fb.group({
      ID_Cidade: [null]  // Campo do formulário
    });
    // Quando o usuário digita no campo, faz a busca com debounce
    this.buscaCidades$.pipe(
      debounceTime(400), // Aguarda 400ms para evitar chamadas excessivas
      distinctUntilChanged(), // Só busca se o valor realmente mudar
      tap(() => this.loading = true), // Ativa o indicador de carregamento
      switchMap(termo => termo.length >= 3 ? this.cidadeService.buscarCidades(termo) : []),
      tap(() => this.loading = false) // Desativa o indicador de carregamento
    ).subscribe(cidades => this.cidades = cidades);

    this.clienteForm = this.fb.group({
      // Tipo_Pessoa: ['', [Validators.required, Validators.maxLength(255)]],
      Tipo_Pessoa: true,
      Nome: ['', [Validators.required, Validators.maxLength(255)]],   
      CPF: ['', Validators.maxLength(500)],
      CNPJ: ['', Validators.maxLength(500)],
      Nascimento: [null, Validators.maxLength(500)],  
      Email: ['', [Validators.required, Validators.maxLength(255)]],
      Telefone: ['', Validators.maxLength(500)],
      Endereco: ['', Validators.maxLength(500)],
      Localizador: [null, Validators.maxLength(500)],
      ID_Cidade: [null, Validators.maxLength(500)],
    });
  }

  onCidadeSelecionada(event: any) {
    console.log("Cidade selecionada:", event);
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      console.log('Cliente Submetido', this.clienteForm.value);
      // Aqui você pode chamar o serviço para salvar os dados
      var cliente = this.clienteForm.getRawValue() as ICliente;
      this._clienteService.addCliente(cliente).subscribe((response) => {
        if(!response.Success) {
          console.log('falha na requisição', response.Message)
        }
        else {
          console.log(response.Message)
        }
      });
      this._router.navigate(['/clientes'], { queryParams: { sucesso: '1' } });
    } else {
      console.log('Formulário Inválido', this.clienteForm.errors);
      this.clienteForm.markAllAsTouched(); // Marca os campos para exibir erros
    }
  }
}