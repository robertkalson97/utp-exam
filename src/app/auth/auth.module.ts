import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { AppSharedModule } from '../shared/shared.module';
import { LoginModule } from './login/login.module';

import { EmailVerificationModule } from './email-verification/email-verification.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { SignupModule } from './signup/signup.module';
import { ForgotPasswordCongratsModule } from './forgot-password-congrats/forgot-password-congrats.module';
import { InviteModule } from './invite/invite.module';
import { SSOModule } from './sso/sso.module';

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    AppSharedModule,
    
    ForgotPasswordModule,
    ResetPasswordModule,
    LoginModule,
    SignupModule,
    ForgotPasswordCongratsModule,
    EmailVerificationModule,
    InviteModule,
    SSOModule
  ],
  providers: []
})
export class AuthModule {
}