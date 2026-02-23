import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard')
        .then(m => m.DashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['HR', 'RECRUITER'] }
  },
  
  {
    path: 'candidates/add',
    loadComponent: () =>
      import('./candidates/candidate-form/candidate-form')
        .then(m => m.CandidateForm),
    canActivate: [authGuard],
    data: { roles: ['HR', 'RECRUITER'] }
  },

  {
    path: 'candidates',
    loadComponent: () =>
      import('./candidates/candidate-list/candidate-list')
        .then(m => m.CandidateListComponent),
    canActivate: [authGuard],
    data: { roles: ['HR', 'RECRUITER','INTERVIEWER'] }
  },


  {
    path: 'candidates/:id',
    loadComponent: () =>
      import('./candidates/candidates-detail/candidates-detail')
        .then(m => m.CandidatesDetailComponent),
    canActivate: [authGuard],
    data: { roles: ['HR', 'RECRUITER', 'INTERVIEWER'] }
  },


  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
