import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ResendOrderModal } from './resend-order-modal.component';

@NgModule({
  declarations: [
    ResendOrderModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ResendOrderModal ]
})
export class ResendOrderModalModule {
}