import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrlUsuario = 'https://localhost:7102/api/Usuario';

  constructor(private httpClient: HttpClient, private router: Router) { }

  logar(usuario: Usuario): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrlUsuario}/login`, usuario).pipe(
      tap((resposta) => {
        if (!resposta.sucesso) return;

        localStorage.setItem('token', btoa(JSON.stringify(resposta.token)));
        localStorage.setItem('usuario', btoa(JSON.stringify(resposta.usuario)));

        // Redireciona para a página inicial
        this.router.navigate(['']);
      })
    )
  }

  // deslogar() {
  //   localStorage.clear();
  //   this.router.navigate(['login']);
  // }

  get obterUsuarioLogado(): Usuario | null {
    const usuario = localStorage.getItem('usuario');
    
    return usuario ? JSON.parse(atob(usuario)) : null;
  }

  get obterIdUsuarioLogado(): string | null {
    const usuario = this.obterUsuarioLogado;
    
    return usuario ? usuario.ID_Usuario : null; 
  }

  // get obterTokenUsuario(): string | null {
  //   const tokenUsuario = localStorage.getItem('Token');

  //   return tokenUsuario ?? null;
  // }

  get logado(): boolean {
    return !!localStorage.getItem('token');
  }
}
