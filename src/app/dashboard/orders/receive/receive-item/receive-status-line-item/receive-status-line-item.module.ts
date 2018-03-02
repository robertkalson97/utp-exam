import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../../shared/shared.module';
import { ReceiveStatusLineItemComponent } from './receive-status-line-item.component';

@NgModule({
  declarations: [ReceiveStatusLineItemComponent],
  exports: [ReceiveStatusLineItemComponent],
  imports: [AppSharedModule],
  providers: []
})
export class ReceiveStatusLineItemModule {

}
