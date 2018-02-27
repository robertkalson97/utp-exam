import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthGuard } from '../../auth-guard.service';

export const ForgotPasswordRoutes = [
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [AuthGuard]
  },
];

//export const routing: ModuleWithProviders = RouterModule.forChild(forgotPasswordRoutes);