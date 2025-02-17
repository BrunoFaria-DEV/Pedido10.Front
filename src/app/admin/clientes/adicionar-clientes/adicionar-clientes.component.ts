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
import { ICidade } from 'app/interfaces/ICidade';

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
export class AdicionarClientesComponent {
  title = "Novo Cliente";
  clienteForm!: FormGroup;
  cidades: any[] = []; 

  constructor(
    private formBuilder: FormBuilder,
    private _clienteService: ClienteService,
    private _router: Router,
    private _cidadeService: CidadeService
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.formBuilder.group({
      Tipo_Pessoa: [true, [Validators.required]],
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

    this._cidadeService.getAll().subscribe({
      next: (response) => {
        this.cidades = response.result || response.data || response || [];
      },
      error: (error) => {
        console.error("Erro ao buscar cidades:", error);
      },
      complete: () => {
        // Após obter as cidades, inicialize a validação do tipo de cliente
        this.tipoCliente(); // Chamando a função aqui
      }
    });
  }

  tipoCliente() {
    const isPessoaFisicaInicial = this.clienteForm.get('Tipo_Pessoa')?.value; // Obtem o valor inicial

    const cpfControl = this.clienteForm.get('CPF');
    const cnpjControl = this.clienteForm.get('CNPJ');

        if (isPessoaFisicaInicial) {
          cpfControl?.enable();
          cnpjControl?.disable();
          cnpjControl?.setValue('');
          cpfControl?.setValidators([Validators.required, Validators.maxLength(14)]);
          cnpjControl?.clearValidators();
        } else {
          cpfControl?.disable();
          cnpjControl?.enable();
          cpfControl?.setValue('');
          cnpjControl?.setValidators([Validators.required, Validators.maxLength(18)]);
          cpfControl?.clearValidators();
        }
        cpfControl?.updateValueAndValidity();
        cnpjControl?.updateValueAndValidity();


    this.clienteForm.get('Tipo_Pessoa')?.valueChanges.subscribe(
      (isPessoaFisica) => {
        const cpfControl = this.clienteForm.get('CPF');
        const cnpjControl = this.clienteForm.get('CNPJ');

        if (isPessoaFisica) {
          cpfControl?.enable();
          cnpjControl?.disable();
          cnpjControl?.setValue('');
          cpfControl?.setValidators([Validators.required, Validators.maxLength(14)]);
          cnpjControl?.clearValidators();
        } else {
          cpfControl?.disable();
          cnpjControl?.enable();
          cpfControl?.setValue('');
          cnpjControl?.setValidators([Validators.required, Validators.maxLength(18)]);
          cpfControl?.clearValidators();
        }
        cpfControl?.updateValueAndValidity();
        cnpjControl?.updateValueAndValidity();
      }
    );
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const cliente: ICliente = this.clienteForm.getRawValue() as ICliente;
      console.log('Cliente Submetido:', cliente);

      this._clienteService.addCliente(cliente).subscribe({
        next: (response) => {
          console.log("Cliente adicionado com sucesso:", response);
          this._router.navigate(['/clientes'], { queryParams: { sucesso: '1' } });
        },
        error: (error) => {
          console.error("Erro ao adicionar cliente:", error);

          if (error.status === 400 && error.error && error.error.errors) {
            const errors = error.error.errors;

            // Exibe os erros de forma mais organizada e específica:
            for (const field in errors) {
              if (errors.hasOwnProperty(field)) {
                const fieldErrors = errors[field];
                fieldErrors.forEach((errorMessage: string) => { // fieldErrors é um array
                  console.error(`Erro no campo ${field}: ${errorMessage}`);
                  // Aqui você pode exibir esses erros para o usuário, por exemplo:
                  const control = this.clienteForm.get(field);
                  if (control) {
                    control.setErrors({ [field]: true }); // Define o erro no controle do formulário
                    control.markAsTouched(); // Marca o campo como tocado para exibir a mensagem de erro
                  }
                });
              }
            }
          } else if (error.error && error.error.message) {
            console.error("Mensagem de erro do backend:", error.error.message);
            // Exibe a mensagem de erro para o usuário (exemplo com alert, adapte conforme necessário)
            alert(error.error.message);
          } else {
            console.error("Erro desconhecido:", error);
            // Exibe uma mensagem genérica para o usuário
            alert("Ocorreu um erro ao adicionar o cliente. Tente novamente mais tarde.");
          }
        }
      });
    } else {
      console.log('Formulário Inválido', this.clienteForm.errors);
      this.clienteForm.markAllAsTouched();
    }
  }
}