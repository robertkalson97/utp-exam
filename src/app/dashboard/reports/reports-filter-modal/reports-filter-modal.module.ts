import { NgModule } from '@angular/core';

import { ReportsFilterModal } from './reports-filter-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ReportsFilterModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ReportsFilterModal ]
})
export class ReportsFilterModalModule {
}