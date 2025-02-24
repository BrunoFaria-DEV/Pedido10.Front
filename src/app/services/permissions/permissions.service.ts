import { Injectable } from '@angular/core';
import { AuthUserService } from '../auth-user.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  userRoles = ['super-admin', 'admin', 'suporte', 'desenvolvimento'];

  constructor(
    private authUserService: AuthUserService
  ) { }

  hasRole(roles: string[]): boolean {
    let userRole = this.authUserService.obterUsuarioLogado?.Tipo_Usuario;
    // console.log("AuthUserService - Tipo de Usuario logado: ", userRole)
    // console.log("AuthUserService - Usuario Logado Atende ao Tipo: ", roles.find((element) => element == userRole) ? true : false)
    return roles.find((element) => element == userRole) ? true : false; 
  }
}
