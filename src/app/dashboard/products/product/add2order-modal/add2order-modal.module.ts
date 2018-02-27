import { NgModule } from '@angular/core';

import { Add2OrderModal } from './add2order-modal.component';
import { AppSharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    Add2OrderModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ Add2OrderModal ]
})
export class Add2OrderModalModule {
}