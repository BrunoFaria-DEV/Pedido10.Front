import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private apiUrl = 'https://localhost:7102/api/Cidade';  // URL da API

  constructor(private http: HttpClient) {}

  buscarCidades(termo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?search=${termo}`);
  }
}