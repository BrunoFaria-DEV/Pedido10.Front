import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CidadeService {
  private apiUrl = 'https://localhost:7102/api/Cidade';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`);
  }

  find(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}