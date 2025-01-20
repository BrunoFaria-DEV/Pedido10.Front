import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthHelperServiceService {

  constructor(private router: Router) { }

  get obterTokenUsuario(): string | null {
    const tokenUsuario = localStorage.getItem('token');

    return tokenUsuario ?? null;
  }

  deslogar() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
