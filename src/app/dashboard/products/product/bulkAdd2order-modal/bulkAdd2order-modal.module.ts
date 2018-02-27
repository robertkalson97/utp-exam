import { NgModule } from '@angular/core';

import { BulkAdd2OrderModal } from './bulkAdd2order-modal.component';
import { AppSharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    BulkAdd2OrderModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ BulkAdd2OrderModal ]
})
export class BulkAdd2OrderModalModule {
}