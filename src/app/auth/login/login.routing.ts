import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthGuard } from '../../auth-guard.service';

export const LoginRoutes = [
  { path: 'login', canActivate: [AuthGuard], component: LoginComponent}
];

//export const routing: ModuleWithProviders = RouterModule.forChild(loginRoutes);