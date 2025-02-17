import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'; // Import correto para throwError
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { AuthHelperServiceService } from '../helpers/auth-helper-service.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authHelperServiceService = inject(AuthHelperServiceService);

  const token = authHelperServiceService.obterTokenUsuario;
  const requestUrl: Array<any> = request.url.split('/');
  const apiUrl: Array<any> = environment.apiUrl.split('/');

  if (request.url.includes('/login')) {
    return next(request);
  }

  if (token && requestUrl[2] === apiUrl[2]) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => { // Tipagem importante aqui
      if (error.status === 401) {
        authHelperServiceService.deslogar();
      }
      return throwError(() => error); // Relança o erro ORIGINAL
    })
  );
};