import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthUserService } from '../auth-user.service';

export const usuarioNaoAutenticadoGuard: CanActivateFn = (route, state) => {
  // injeção de dependências
  const authUserService = inject(AuthUserService);
  const router = inject(Router);

  // Verifica se o usuario esta logado
  if(authUserService.logado) {
    return router.parseUrl('');
  }

  // se não estiver logado
  return true;
};