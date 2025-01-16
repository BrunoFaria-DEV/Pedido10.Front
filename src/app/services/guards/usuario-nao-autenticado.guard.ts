import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { UsuarioService } from '../usuario.service';

export const usuarioNaoAutenticadoGuard: CanActivateFn = (route, state) => {
  // injeção de dependências
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  // Verifica se o usuario esta logado
  if(usuarioService.logado) {
    return router.parseUrl('');
  }

  // se não estiver logado
  return true;
};