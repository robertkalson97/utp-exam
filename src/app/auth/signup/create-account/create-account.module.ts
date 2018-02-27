import { NgModule } from '@angular/core';

import { CreateAccountComponent } from './create-account.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    CreateAccountComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class CreateAccountModule {
}