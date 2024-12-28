import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        data: { openWhenAuthenticated: false },
        canActivate: [authGuard],
        loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes),
    },
    {
        path: 'home',
        data: { openWhenAuthenticated: true },
        canActivate: [authGuard],
        loadComponent: () =>
            import('./home/home.component').then(
                (c) => c.HomeComponent
            ),
    },
    {
        path: 'error-404',
        loadComponent: () =>
            import('./error-404/error-404.component').then(
                (c) => c.Error404Component
            ),
    },
    {
        path: '**',
        redirectTo: 'error-404',
        pathMatch: 'full',
    },
];
