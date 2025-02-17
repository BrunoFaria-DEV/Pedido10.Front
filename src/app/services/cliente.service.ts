import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ICliente } from 'app/interfaces/ICliente';
import { IClienteCreate } from 'app/interfaces/IClienteCreate';

// export interface Cliente {
//   ID_Cliente?: number;
//   Tipo_Pessoa: boolean;  
//   Nome: string;    
//   CPF?: string;
//   CNPJ?: string;
//   Nascimento?: Date;  
//   Email: string;
//   Telefone?: string;
//   Endereco?: string;
//   Localizador?: string;
//   ID_Cidade?: number;
// }

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'https://localhost:7102/api/Cliente';

  constructor(private http: HttpClient) {}

  // getAll(): Observable<ICliente[]> {
  //   return this.http.get<{ status: number; message: string; result: ICliente[] }>(`${this.apiUrl}`)
  //   .pipe(
  //     map(response => response.result),
  //     catchError((error)=> {
  //       let errorMessage = 'Ocorreu um erro inesperado';

  //       if (error.status == 400) {
  //         errorMessage = `erro 400`;
  //         return throwError(() => new Error(errorMessage));
  //       }
  //       else if (error.status !== 200) {
  //         errorMessage = `Erro ${error.status}: ${error.message || 'Erro desconhecido'}`;
  //       }
  //       return throwError(() => new Error(errorMessage));
  //     })
  //   );
  // }

  getAll(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`);
  }

  find(id: number): Observable<ICliente> {
    return this.http.get<ICliente>(`${this.apiUrl}/${id}`);
  }

  addCliente(cliente: IClienteCreate): Observable<IClienteCreate> {
    return this.http.post<IClienteCreate>(`${this.apiUrl}`, cliente);
  }

  updateCliente(id: number, cliente: ICliente): Observable<ICliente> {
    return this.http.put<ICliente>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<ICliente> {
    return this.http.delete<ICliente>(`${this.apiUrl}/${id}`);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    let errorMessage = '';

    if (error.status == 400) {
      errorMessage = `erro 400`;
      return throwError(() => new Error(errorMessage));
    }
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente ou de rede
      errorMessage = `Erro! Verifique sua conexão`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Erro interno. Tente novamente mais tarde!`;
      console.log(error)
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}