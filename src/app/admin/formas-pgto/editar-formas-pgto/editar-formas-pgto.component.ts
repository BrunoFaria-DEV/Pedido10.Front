
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { IFormaPgto } from 'app/interfaces/IFormaPgto';
import { FormaPgtoService } from 'app/services/forma-pgto.service';

import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { CidadeService } from 'app/services/cidade.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-editar-formas-pgto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgSelectModule
  ],
  templateUrl: './editar-formas-pgto.component.html',
  styleUrl: './editar-formas-pgto.component.scss'
})
export class EditarFormasPgtoComponent implements OnInit {
  title = "Nova Forma De Pagamento";
  formaPgtoForm!: FormGroup;
  id!: number;

  constructor(
    private formBuilder: FormBuilder,
    private _formaPgtoService: FormaPgtoService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
    });

    this.formaPgtoForm = this.formBuilder.group({
      Desc_Forma_PGTO: [null, [Validators.required, Validators.maxLength(15)]],
    });

    this._formaPgtoService.find(this.id).subscribe({
      next: (response) => {
        this.formaPgtoForm.patchValue(response.formaPgto.Result);
      },
      error: (error) => {
        console.error("Erro ao buscar o formaPgto:", error);
      }
    });
  }

  onSubmit() {
    if (this.formaPgtoForm.valid) {
      const formaPgto: IFormaPgto = this.formaPgtoForm.getRawValue() as IFormaPgto;

      this._formaPgtoService.updateFormaPgto(this.id, formaPgto).subscribe({

        next: (response) => {
          console.log("FormaPgto editada com sucesso:", response);
          this._router.navigate(['/formas-pgto'], { queryParams: { sucesso: '1' } });
        },
        error: (error) => {
          if (error.status === 400) {
            const errors = error.error.errors;
            if (errors) {
              for (const field in errors) {
                if (this.formaPgtoForm.get(field)) {
                  this.formaPgtoForm.get(field)?.setErrors({ [field]: errors[field] });
                  this.formaPgtoForm.get(field)?.markAsTouched();
                }
              }
            }
          }
          else if (error.error && error.error.message) {
            console.error("Mensagem de erro do backend:", error.error.message);
            alert(error.error.message);
          } else {
            console.error("Erro desconhecido:", error);
            alert("Ocorreu um erro ao adicionar o formaPgto. Tente novamente mais tarde.");
          }
        }

      });
    } else {
      console.log('Formulário Inválido', this.formaPgtoForm.errors);
      this.formaPgtoForm.markAllAsTouched();
    }
    console.log(this.formaPgtoForm.value)
  }
}