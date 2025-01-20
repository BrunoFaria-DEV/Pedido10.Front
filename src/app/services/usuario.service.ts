import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrlUsuario = 'https://localhost:7102/api/Usuario';

  constructor(private httpClient: HttpClient, private router: Router) { }

  GetAll(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrlUsuario}/all`)
    /* esta sessão abaixo é exclusiva para garatir uma verificação
     a mais sobre o usuário logado, mas pode funcionar sem ela */
    .pipe(
      tap((resposta) => {
        if (!resposta.sucesso) {
          console.error('Erro ao obter a lista de usuários.');
        }
      }),
      catchError((error) => {
        console.error('Erro na requisição:', error);
        throw error;
      })
    );
    //////////////////////////////////////////////////////////////
  }

}
