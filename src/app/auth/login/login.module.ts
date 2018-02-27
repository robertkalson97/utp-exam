import { NgModule } from '@angular/core';

import { LoginComponent } from './login.component';
import { AppSharedModule } from '../../shared/shared.module';

// for lazy loading
//import { routing } from './login.routing';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    //routing,
    AppSharedModule
  ],
  providers: []
})
export class LoginModule {
}