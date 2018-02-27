import { NgModule } from '@angular/core';

import { ForgotPasswordCongratsComponent } from './forgot-password-congrats.component';
import { AppSharedModule } from '../../shared/shared.module';

// for lazy loading
//import { routing } from './forgot-password-congrats.routing';

@NgModule({
  declarations: [
    ForgotPasswordCongratsComponent
  ],
  imports: [
    //routing,
    AppSharedModule
  ],
  providers: []
})
export class ForgotPasswordCongratsModule {
}