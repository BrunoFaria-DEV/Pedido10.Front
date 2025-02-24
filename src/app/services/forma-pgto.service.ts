import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFormaPgto } from 'app/interfaces/IFormaPgto';

@Injectable({
  providedIn: 'root'
})
export class FormaPgtoService {
  private apiUrl = 'https://localhost:7102/api/FormaPgto';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}`);
  }

  find(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/${id}`);
  }

  addFormaPgto(formaPgto: IFormaPgto): Observable<IFormaPgto> {
    return this.httpClient.post<IFormaPgto>(`${this.apiUrl}`, formaPgto);
  }

  updateFormaPgto(id: number, formaPgto: IFormaPgto): Observable<IFormaPgto> {
    return this.httpClient.put<IFormaPgto>(`${this.apiUrl}/${id}`, formaPgto);
  }

  deleteFormaPgto(id: number): Observable<IFormaPgto> {
    return this.httpClient.delete<IFormaPgto>(`${this.apiUrl}/${id}`);
  }
}