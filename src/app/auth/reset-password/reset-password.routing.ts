import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';

export const ResetPasswordRoutes = [
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: []
  },
];

//export const routing: ModuleWithProviders = RouterModule.forChild(resetPasswordRoutes);