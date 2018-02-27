import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared/shared.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class ReportsModule {
}