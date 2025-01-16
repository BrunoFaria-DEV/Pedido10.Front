import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { AuthHelperServiceService } from '../helpers/auth-helper-service.service'; 

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authHelperServiceService = inject(AuthHelperServiceService);

  const token = authHelperServiceService.obterTokenUsuario; // Token do usuário
  const requestUrl: Array<any> = request.url.split('/');
  const apiUrl: Array<any> = environment.apiUrl.split('/');

  // Verifica se o token existe e a URL é da API esperada
  if (token && requestUrl[2] === apiUrl[2]) {
    console.log(requestUrl);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        token: `${token}`,
      },
    });

    // Trata erros, como status 401
    return next(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          authHelperServiceService.deslogar(); // Desloga se o token não for válido
        }
        return throwError(() => new Error(error.message));
      })
    );
  }

  return next(request);
};