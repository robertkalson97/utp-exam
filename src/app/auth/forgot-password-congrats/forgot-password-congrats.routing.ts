import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordCongratsComponent } from './forgot-password-congrats.component';

export const ForgotPasswordCongratsRoutes = [
  { path: 'forgot-password-congrats', component: ForgotPasswordCongratsComponent },
];

//export const routing: ModuleWithProviders = RouterModule.forChild(forgotPasswordCongratsRoutes);