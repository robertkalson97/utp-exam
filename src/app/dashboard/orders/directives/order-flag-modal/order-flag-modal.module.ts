import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';

import { OrderFlagModalComponent } from './order-flag-modal.component';

@NgModule({
  imports: [
    AppSharedModule
  ],
  declarations: [
    OrderFlagModalComponent,
  ],
  entryComponents: [
    OrderFlagModalComponent,
  ],
  exports: [
    OrderFlagModalComponent,
  ]
})
export class OrderFlagModalModule {
}
