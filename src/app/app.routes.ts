import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ModuleSelectorComponent } from './components/module-selector/module-selector.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'module-selector', component: ModuleSelectorComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/login' },
];
