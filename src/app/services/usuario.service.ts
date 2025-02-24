import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { IUsuarioCreate } from 'app/interfaces/IUsuarioCreate';
import { IUsuario } from 'app/interfaces/IUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://localhost:7102/api/Usuario';

  constructor(private httpClient: HttpClient, private router: Router) { }

  getAll(): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}/all`);
  }

  find(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/${id}`);
  }

  addUsuario(usuario: IUsuario): Observable<IUsuario> {
    return this.httpClient.post<IUsuario>(`${this.apiUrl}`, usuario);
  }

  updateUsuario(id: number, usuario: IUsuario): Observable<IUsuario> {
    return this.httpClient.put<IUsuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<IUsuario> {
    return this.httpClient.delete<IUsuario>(`${this.apiUrl}/${id}`);
  }
}