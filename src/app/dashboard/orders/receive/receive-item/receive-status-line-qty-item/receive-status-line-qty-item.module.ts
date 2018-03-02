import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../../shared/shared.module';
import { ReceiveStatusLineQtyItemComponent } from './receive-status-line-qty-item.component';

@NgModule({
  declarations: [ReceiveStatusLineQtyItemComponent],
  exports: [ReceiveStatusLineQtyItemComponent],
  imports: [AppSharedModule],
  providers: []
})
export class ReceiveStatusLineQtyItemModule {

}
