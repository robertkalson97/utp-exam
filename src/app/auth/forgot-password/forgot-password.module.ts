import { NgModule } from '@angular/core';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AppSharedModule } from '../../shared/shared.module';

// for lazy loading
//import { routing } from './forgot-password.routing';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
  ],
  imports: [
    //routing,
    AppSharedModule
  ],
  providers: []
})
export class ForgotPasswordModule {
}