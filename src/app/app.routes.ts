import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home')
  },
  {
    path: 'bug-1-value-reset',
    loadComponent: () => import('./pages/bug1-value-reset/bug1-value-reset')
  },
  {
    path: 'bug-2-error-handling',
    loadComponent: () => import('./pages/bug2-error-handling/bug2-error-handling')
  },
  {
    path: 'bug-3-reload',
    loadComponent: () => import('./pages/bug3-reload/bug3-reload')
  }
];
