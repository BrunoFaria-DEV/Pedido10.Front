import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

export interface Produto {
  ID_Produto?: number;          // int? → Opcional
  Nome_Produto: string;         // string (obrigatório)
  Descricao?: string;           // string? → Opcional
  Custo_Producao?: number;      // decimal? → Opcional e convertido para number
  Margem_Lucro?: number;        // decimal? → Opcional e convertido para number
  Preco: number;                // decimal → Obrigatório
  QTDE_Estoque: number;         // int → Obrigatório
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://localhost:7102/api/Produto';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`)
  }

  getByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-name?name=${encodeURIComponent(name)}`);
  }

  addProduto(produto: Produto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, produto);
  }

  updateProduto(id: number, produto: Produto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, produto);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}