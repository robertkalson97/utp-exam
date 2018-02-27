import { NgModule } from '@angular/core';

import { ResetPasswordComponent } from './reset-password.component';
import { AppSharedModule } from '../../shared/shared.module';

// for lazy loading
//import { routing } from './reset-password.routing';

@NgModule({
  declarations: [
    ResetPasswordComponent,
  ],
  imports: [
    //routing,
    AppSharedModule
  ],
  providers: []
})
export class ResetPasswordModule {
}