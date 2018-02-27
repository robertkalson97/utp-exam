import { NgModule } from '@angular/core';

import { EmailVerificationComponent } from './email-verification.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    EmailVerificationComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class EmailVerificationModule {
}