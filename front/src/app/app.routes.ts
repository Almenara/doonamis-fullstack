import { Routes } from '@angular/router';
import { Home } from './features/components/home/home.component';
import { Login } from './features/components/login/login';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: Home,
    },
    {
        path: 'login',
        component: Login,
    },
];
