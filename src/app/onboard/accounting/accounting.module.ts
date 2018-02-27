import { NgModule } from '@angular/core';

import { AccountingComponent } from './accounting.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AccountingComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class AccountingModule {
}