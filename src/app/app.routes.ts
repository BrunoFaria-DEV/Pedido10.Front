import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HomeComponent } from './admin/home/home.component';
import { usuarioNaoAutenticadoGuard } from './services/guards/usuario-nao-autenticado.guard';
import { usuarioAutenticadoGuard } from './services/guards/usuario-autenticado.guard';
import { ClientesComponent } from './admin/clientes/clientes.component';
import { ProdutosComponent } from './admin/produtos/produtos.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { AdicionarProdutosComponent } from './admin/produtos/adicionar-produtos/adicionar-produtos.component';
import { EditarProdutosComponent } from './admin/produtos/editar-produtos/editar-produtos.component';
import { AdicionarClientesComponent } from './admin/clientes/adicionar-clientes/adicionar-clientes.component';
import { EditarClientesComponent } from './admin/clientes/editar-clientes/editar-clientes.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [usuarioNaoAutenticadoGuard] },
    {
        path: '', component: DashboardComponent, canActivate: [usuarioAutenticadoGuard], children: [
            { path: '', component: HomeComponent },
            { path: 'clientes', component: ClientesComponent},
            { path: 'clientes/novo', component: AdicionarClientesComponent},
            { path: 'clientes/editar/:id', component: EditarClientesComponent},
            { path: 'produtos', component: ProdutosComponent},
            { path: 'produtos/novo', component: AdicionarProdutosComponent},
            { path: 'produtos/editar/:id', component: EditarProdutosComponent},
            { path: 'usuarios', component: UsuariosComponent},
        ],
    },
    // { path: '**', component: PageNotFoundComponent },
];