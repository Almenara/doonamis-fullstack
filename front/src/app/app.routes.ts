import { Routes } from '@angular/router';
import { Home } from './features/components/home/home.component';
import { Login } from './features/components/login/login';
import { AuthGuard, LoginGuard } from './guards/auth.guard';
import { UserImport } from './features/components/users/import/import';
import { UserList } from './features/components/users/list/list';
export const routes: Routes = [

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: 'login',
        component: Login,
        canActivate: [LoginGuard]        
    },
    {
        component: Home,
        path: 'home',
        canActivate: [AuthGuard],
    },
    {
        path: 'users',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'import',
                component: UserImport,
            },
            {
                path: 'list',
                component: UserList,
            }
        ]
    }
];
