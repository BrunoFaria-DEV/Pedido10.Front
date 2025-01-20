import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUsuario } from '../../interfaces/IUsuario';
import { AuthUserService } from 'app/services/auth-user.service';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatInputModule,
		MatButtonModule,
		MatSidenavModule,
		MatIconModule,
		MatToolbarModule,
		MatSnackBarModule,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
	formLogin!: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private authUserService: AuthUserService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		this.criarForm();
	}

	criarForm() {
		this.formLogin = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			senha: ['', [Validators.required]]
		});
	}

	logar() {
		if (this.formLogin.invalid) return;

		var usuario = this.formLogin.getRawValue() as IUsuario;

		this.authUserService.logar(usuario).subscribe((response) => {
			if (!response.sucesso) {
				this.snackBar.open(
					'Falha na autenticação', 'Usuário ou senha incorretos.', 
					{ duration: 3000 }
				);
			}
			else {
				console.log(response)
			}
		});
	}

}