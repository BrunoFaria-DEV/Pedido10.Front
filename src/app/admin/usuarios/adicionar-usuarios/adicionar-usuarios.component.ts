import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { IUsuario } from 'app/interfaces/IUsuario';
import { UsuarioService } from 'app/services/usuario.service';

import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { CidadeService } from 'app/services/cidade.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-adicionar-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgSelectModule,
    NgxMaskDirective, 
    NgxMaskPipe
  ],
  templateUrl: './adicionar-usuarios.component.html',
  styleUrl: './adicionar-usuarios.component.scss'
})
export class AdicionarUsuariosComponent implements OnInit {
  title = "Novo Usuario";
  usuarioForm!: FormGroup;
  tipoUsuarios: string[] = ["admin", "usuario"]

  constructor(
    private formBuilder: FormBuilder,
    private _usuarioService: UsuarioService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.formBuilder.group({
      Tipo_Usuario: [this.tipoUsuarios[1], [Validators.required, Validators.maxLength(14)]],
      Nome: ['', [Validators.required, Validators.maxLength(120)]],
      Email: ['', [Validators.email, Validators.required, Validators.maxLength(120)]],
      Senha: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      ConfirmarSenha: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
    });
  }

  confirmPassword()
  {
    let confirmarSenha = this.usuarioForm.get('ConfirmarSenha')?.value;
    let senha = this.usuarioForm.get('Senha')?.value;

    if (!senha && !confirmarSenha) {
      this.usuarioForm.get('ConfirmarSenha')?.setErrors(null);
      console.log('campos vazios')
    }
    else if (senha !== confirmarSenha){
      this.usuarioForm.get('ConfirmarSenha')?.setErrors({ 'confirmPassword': true });
    } 
    else {
      this.usuarioForm.get('ConfirmarSenha')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      const usuario: IUsuario = this.usuarioForm.getRawValue() as IUsuario;

      this._usuarioService.addUsuario(usuario).subscribe({

        next: (response) => {
          console.log("Usuario adicionado com sucesso:", response);
          this._router.navigate(['/usuarios'], { queryParams: { sucesso: '1' } });
        },
        error: (error) => {
          if (error.status === 400) {
            const errors = error.error.errors;
            if (errors) {
              for (const field in errors) {
                if (this.usuarioForm.get(field)) {
                  this.usuarioForm.get(field)?.setErrors({ [field]: errors[field] });
                  this.usuarioForm.get(field)?.markAsTouched();
                }
              }
            }
          }
          else if (error.error && error.error.message) {
            console.error("Mensagem de erro do backend:", error.error.message);
            alert(error.error.message);
          } else {
            console.error("Erro desconhecido:", error);
            alert("Ocorreu um erro ao adicionar o usuario. Tente novamente mais tarde.");
          }
        }

      });
    } else {
      console.log('Formulário Inválido', this.usuarioForm.errors);
      this.usuarioForm.markAllAsTouched();
    }
    console.log(this.usuarioForm.value)
  }
}