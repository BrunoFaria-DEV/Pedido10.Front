import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICliente } from 'app/interfaces/ICliente';
import { ClienteService } from 'app/services/cliente.service';

@Component({
  selector: 'app-editar-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './editar-clientes.component.html',
  styleUrl: './editar-clientes.component.scss'
})
export class EditarClientesComponent implements OnInit {
  title = "Editar Cliente";
  id!: number;
  clienteForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private _clienteService: ClienteService,
    private _router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Captura o ID da URL
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));

      // Inicializa o formulário antes de buscar os dados
      this.clienteForm = this.fb.group({
        Tipo_Pessoa: ['', [Validators.required, Validators.maxLength(255)]],
        Nome: ['', [Validators.required, Validators.maxLength(255)]],   
        CPF: ['', Validators.maxLength(500)],
        CNPJ: ['', Validators.maxLength(500)],
        Nascimento: ['', Validators.maxLength(500)],  
        Email: ['', [Validators.required, Validators.maxLength(255)]],
        Telefone: ['', Validators.maxLength(500)],
        Endereco: ['', Validators.maxLength(500)],
        Localizador: ['', Validators.maxLength(500)],
        ID_Cidade: ['', Validators.maxLength(500)],
      });

      // Busca os dados do cliente e preenche o formulário
      // this._clienteService.find(this.id).subscribe(cliente => {
      //   console.log("Dados do Cliente recebidos:", cliente.cliente.Result);
      //   if (cliente.cliente.Success) {
      //     this.clienteForm.patchValue(cliente.cliente.Result);
      //   }
      // });
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      console.log('Cliente Submetido', this.clienteForm.value);

      var cliente = this.clienteForm.getRawValue() as ICliente;
      this._clienteService.updateCliente(this.id, cliente).subscribe((response) => {
        // if(!response.Success) {
        //   console.log('falha na requisição', cliente)
        // }
        // else {
        //   console.log(response)
        // }
      });
      this._router.navigate(['/clientes'], { queryParams: { sucesso: '1' } });
    } else {
      console.log('Formulário Inválido', this.clienteForm.errors);
      this.clienteForm.markAllAsTouched(); // Marca os campos para exibir erros
    }
  }
}