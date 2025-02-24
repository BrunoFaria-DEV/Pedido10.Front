import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ICliente } from 'app/interfaces/ICliente';
import { CidadeService } from 'app/services/cidade.service';
import { ClienteService } from 'app/services/cliente.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';


@Component({
  selector: 'app-editar-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgSelectModule,
    NgxMaskDirective, 
    NgxMaskPipe
  ],
  templateUrl: './editar-clientes.component.html',
  styleUrl: './editar-clientes.component.scss'
})
export class EditarClientesComponent implements OnInit {
  title = "Editar Cliente";
  clienteForm!: FormGroup;
  id!: number;
  cidades: any[] = [];

  constructor(
    private formBuilder: FormBuilder, 
    private _clienteService: ClienteService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cidadeService: CidadeService
  ) {}

  ngOnInit(): void {
    // Captura o ID da URL
    this._route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
    });

    this.clienteForm = this.formBuilder.group({
      Tipo_Pessoa: [true, [Validators.required]],
      Nome: ['', [Validators.required, Validators.maxLength(100)]],
      CPF: ['', [Validators.pattern('^[0-9]{11}$')]],
      CNPJ: ['', [Validators.pattern('^[0-9]{14}$')]],
      Nascimento: [null, Validators.maxLength(500)],
      Email: ['', [Validators.required, Validators.maxLength(50)]],
      Telefone: ['', Validators.maxLength(15)],
      Endereco: ['', Validators.maxLength(150)],
      Localizador: [null, Validators.maxLength(255)],
      ID_Cidade: [null, Validators.maxLength(500)],
    });

    this._cidadeService.getAll().subscribe({
      next: (response) => {
        this.cidades = response.result || response.data || response || [];
      },
      error: (error) => {
        console.error("Erro ao buscar cidades:", error);
      }
    });

    this._clienteService.find(this.id).subscribe({
      next: (response) => {
        this.clienteForm.patchValue(response.cliente.Result);
      },
      error: (error) => {
        console.error("Erro ao buscar o cliente:", error);
      },
      complete: () => {
        console.log('Formulário após patchValue:', this.clienteForm);
        this.tipoCliente();
      }
    });
  }

  tipoCliente() {
    const isPessoaFisicaInicial = this.clienteForm.get('Tipo_Pessoa')?.value;

    const cpfControl = this.clienteForm.get('CPF');
    const cnpjControl = this.clienteForm.get('CNPJ');

        if (isPessoaFisicaInicial) {
          cpfControl?.enable();
          cnpjControl?.disable();
          // cnpjControl?.setValue('');
          cpfControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{11}$')]);
          cnpjControl?.clearValidators();
        } else {
          cpfControl?.disable();
          cnpjControl?.enable();
          // cpfControl?.setValue('');
          cnpjControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{14}$')]);
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
          // cnpjControl?.setValue('');
          cpfControl?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
          cnpjControl?.clearValidators();
        } else {
          cpfControl?.disable();
          cnpjControl?.enable();
          // cpfControl?.setValue('');
          cnpjControl?.setValidators([Validators.required, Validators.minLength(14), Validators.maxLength(14)]);
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

      this._clienteService.updateCliente(this.id, cliente).subscribe({
        next: (response) => {
          console.log("Cliente Editado com sucesso:", response);
          this._router.navigate(['/clientes'], { queryParams: { sucesso: '1' } });
        },
        error: (error) => {
          if (error.status === 400) {
            const errors = error.error.errors;
            if (errors) {
              for (const field in errors) {
                if (this.clienteForm.get(field)) {
                  this.clienteForm.get(field)?.setErrors({ [field]: errors[field] });
                  this.clienteForm.get(field)?.markAsTouched();
                }
              }
            }
          }
          else if (error.error && error.error.message) {
            console.error("Mensagem de erro do backend:", error.error.message);
            alert(error.error.message);
          } else {
            console.error("Erro desconhecido:", error);
            alert("Ocorreu um erro ao adicionar o cliente. Tente novamente mais tarde.");
          }
        }
      });
    } else {
      console.log('Formulário Inválido', this.clienteForm.errors);
      this.clienteForm.markAllAsTouched();
    }
    console.log(this.clienteForm.value)
  }
}