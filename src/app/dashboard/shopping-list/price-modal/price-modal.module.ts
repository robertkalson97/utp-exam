import { NgModule } from '@angular/core';

import { PriceModal } from './price-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    PriceModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ PriceModal ]
})
export class PriceModalModule {
}