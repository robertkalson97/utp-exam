import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared/shared.module';
import { SSOComponent } from './sso.component';

@NgModule({
  declarations: [
    SSOComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class SSOModule {

}