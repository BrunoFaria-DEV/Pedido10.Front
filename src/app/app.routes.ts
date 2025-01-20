import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HomeComponent } from './admin/home/home.component';
import { usuarioNaoAutenticadoGuard } from './services/guards/usuario-nao-autenticado.guard';
import { usuarioAutenticadoGuard } from './services/guards/usuario-autenticado.guard';
import { ClientesComponent } from './admin/clientes/clientes.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [usuarioNaoAutenticadoGuard] },
    {
        path: '', component: DashboardComponent, canActivate: [usuarioAutenticadoGuard], children: [
            { path: '', component: HomeComponent },
            { path: 'clientes', component: ClientesComponent },
        ],
    },
    // { path: '**', component: PageNotFoundComponent },
];