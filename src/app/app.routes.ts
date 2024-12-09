import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes),
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./home/home.component').then(
                (c) => c.HomeComponent
            ),
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
    },
];
