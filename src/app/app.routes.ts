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
import { PedidosComponent } from './admin/pedidos/pedidos.component';
import { AdicionarPedidosComponent } from './admin/pedidos/adicionar-pedidos/adicionar-pedidos.component';
import { EditarPedidosComponent } from './admin/pedidos/editar-pedidos/editar-pedidos.component';
import { AdicionarUsuariosComponent } from './admin/usuarios/adicionar-usuarios/adicionar-usuarios.component';
import { EditarUsuariosComponent } from './admin/usuarios/editar-usuarios/editar-usuarios.component';
import { FormasPgtoComponent } from './admin/formas-pgto/formas-pgto.component';
import { AdicionarFormasPgtoComponent } from './admin/formas-pgto/adicionar-formas-pgto/adicionar-formas-pgto.component';
import { EditarFormasPgtoComponent } from './admin/formas-pgto/editar-formas-pgto/editar-formas-pgto.component';

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

            { path: 'pedidos', component: PedidosComponent},
            { path: 'pedidos/novo', component: AdicionarPedidosComponent},
            { path: 'pedidos/editar/:id', component: EditarPedidosComponent},

            { path: 'usuarios', component: UsuariosComponent},
            { path: 'usuarios/novo', component: AdicionarUsuariosComponent},
            { path: 'usuarios/editar/:id', component: EditarUsuariosComponent},
            
            { path: 'formas-pgto', component: FormasPgtoComponent},
            { path: 'formas-pgto/novo', component: AdicionarFormasPgtoComponent},
            { path: 'formas-pgto/editar/:id', component: EditarFormasPgtoComponent},
        ],
    },
    // { path: '**', component: PageNotFoundComponent },
];