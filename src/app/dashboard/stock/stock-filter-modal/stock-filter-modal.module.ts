import { NgModule } from '@angular/core';

import { StockFilterModal } from './stock-filter-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    StockFilterModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ StockFilterModal ]
})
export class StockFilterModalModule {}
