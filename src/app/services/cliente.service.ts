import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

export interface Cliente {
  ID_Cliente?: number;
  Tipo_Pessoa: boolean;  
  Nome: string;    
  CPF?: string;
  CNPJ?: string;
  Nascimento?: Date;  
  Email: string;
  Telefone?: string;
  Endereco?: string;
  Localizador?: string;
  ID_Cidade?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'https://localhost:7102/api/Cliente';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`)
  }

  find(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addCliente(cliente: Cliente): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, cliente);
  }

  updateCliente(id: number, cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}