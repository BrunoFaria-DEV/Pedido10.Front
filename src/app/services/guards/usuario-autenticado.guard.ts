import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { UsuarioService } from '../usuario.service';

export const usuarioAutenticadoGuard: CanActivateFn = (route, state) => {
  // injeção de dependências
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  // verificar se o usuario está logado
  if(usuarioService.logado) {
    return true;
  }

  // redireciona se não estiver logado
  return router.parseUrl('/login');
};