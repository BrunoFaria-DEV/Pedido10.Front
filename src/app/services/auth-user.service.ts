import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {
  private apiUrlUsuario = 'https://localhost:7102/api/Usuario';

  constructor(private httpClient: HttpClient, private router: Router) { }

  logar(usuario: Usuario): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrlUsuario}/login`, usuario).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return of({ sucesso: false, mensagem: 'Usuário ou senha incorretos.' });
        }

        return throwError(() => new Error(error.message));
      }),
      tap((resposta) => {
        if (!resposta.sucesso) return;

        localStorage.setItem('token', resposta.token);
        localStorage.setItem('usuario', btoa(JSON.stringify(resposta.usuario)));

        this.router.navigate(['']);
      })
    );
  }

  get obterUsuarioLogado(): Usuario | null {
    const usuario = localStorage.getItem('usuario');

    return usuario ? JSON.parse(atob(usuario)) : null;
  }

  get obterIdUsuarioLogado(): string | null {
    const usuario = this.obterUsuarioLogado;

    return usuario ? usuario.ID_Usuario : null;
  }

  get logado(): boolean {
    return !!localStorage.getItem('token');
  }
}