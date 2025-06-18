import { Routes } from '@angular/router';
import { Home } from './features/components/home/home.component';
import { Login } from './features/components/login/login';
import { AuthGuard, LoginGuard } from './guards/auth.guard';

export const routes: Routes = [

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        component: Home,
        path: 'home',
        canActivate: [AuthGuard],
    },
    {
        path: 'login',
        component: Login,
        canActivate: [LoginGuard]        
    },
];
