import { NgModule } from '@angular/core';

import { DashboardFilterModal } from './dashboard-filter-modal.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    DashboardFilterModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ DashboardFilterModal ]
})
export class DashboardFilterModalModule {
}