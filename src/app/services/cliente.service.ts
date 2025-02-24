import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ICliente } from 'app/interfaces/ICliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'https://localhost:7102/api/Cliente';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`);
  }

  find(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addCliente(cliente: ICliente): Observable<ICliente> {
    return this.http.post<ICliente>(`${this.apiUrl}`, cliente);
  }

  updateCliente(id: number, cliente: ICliente): Observable<ICliente> {
    return this.http.put<ICliente>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<ICliente> {
    return this.http.delete<ICliente>(`${this.apiUrl}/${id}`);
  }
}