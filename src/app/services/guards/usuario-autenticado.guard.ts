import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthUserService } from '../auth-user.service';

export const usuarioAutenticadoGuard: CanActivateFn = (route, state) => {
  // injeção de dependências
  const authUserService = inject(AuthUserService);
  const router = inject(Router);

  // verificar se o usuario está logado
  if(authUserService.logado) {
    return true;
  }

  // redireciona se não estiver logado
  return router.parseUrl('/login');
};